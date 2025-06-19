import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { CreateSurveyRequest, UpdateSurveyRequest, Survey } from '@/types';

// Query keys for consistent cache management
export const surveyKeys = {
  all: ['surveys'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...surveyKeys.lists(), { filters }] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: number) => [...surveyKeys.details(), id] as const,
  my: () => [...surveyKeys.all, 'my'] as const,
  count: () => [...surveyKeys.all, 'count'] as const,
  public: () => [...surveyKeys.all, 'public'] as const,
};

// Get user's surveys
export function useMySurveys() {
  return useQuery({
    queryKey: surveyKeys.my(),
    queryFn: () => apiClient.surveys.getMySurveys(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get survey count
export function useSurveyCount() {
  return useQuery({
    queryKey: surveyKeys.count(),
    queryFn: () => apiClient.surveys.getSurveyCount(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get public surveys
export function usePublicSurveys() {
  return useQuery({
    queryKey: surveyKeys.public(),
    queryFn: () => apiClient.surveys.getPublicSurveys(),
    staleTime: 1000 * 60 * 5,
  });
}

// Get survey by ID
export function useSurvey(id: number) {
  return useQuery({
    queryKey: surveyKeys.detail(id),
    queryFn: () => apiClient.surveys.getSurveyById(id),
    enabled: !!id,
  });
}

// Create survey mutation
export function useCreateSurvey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSurveyRequest) => apiClient.surveys.createSurvey(data),
    onSuccess: (newSurvey) => {
      // Invalidate and refetch surveys
      queryClient.invalidateQueries({ queryKey: surveyKeys.my() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.count() });
      
      // Add the new survey to the cache
      queryClient.setQueryData(surveyKeys.detail(newSurvey.id), newSurvey);
      
      toast.success('Survey created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create survey');
    },
  });
}

// Update survey mutation
export function useUpdateSurvey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSurveyRequest }) => 
      apiClient.surveys.updateSurvey(id, data),
    onSuccess: (updatedSurvey) => {
      // Update the specific survey in cache
      queryClient.setQueryData(surveyKeys.detail(updatedSurvey.id), updatedSurvey);
      
      // Update the survey in the my surveys list
      queryClient.setQueryData(surveyKeys.my(), (old: Survey[] | undefined) => {
        if (!old) return old;
        return old.map(survey => 
          survey.id === updatedSurvey.id ? updatedSurvey : survey
        );
      });
      
      toast.success('Survey updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update survey');
    },
  });
}

// Delete survey mutation
export function useDeleteSurvey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.surveys.deleteSurvey(id),
    onSuccess: (_, deletedId) => {
      // Remove survey from cache
      queryClient.removeQueries({ queryKey: surveyKeys.detail(deletedId) });
      
      // Update the my surveys list
      queryClient.setQueryData(surveyKeys.my(), (old: Survey[] | undefined) => {
        if (!old) return old;
        return old.filter(survey => survey.id !== deletedId);
      });
      
      // Invalidate count
      queryClient.invalidateQueries({ queryKey: surveyKeys.count() });
      
      toast.success('Survey deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete survey');
    },
  });
}

// Publish survey mutation
export function usePublishSurvey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.surveys.publishSurvey(id),
    onSuccess: (publishedSurvey) => {
      // Update the specific survey in cache
      queryClient.setQueryData(surveyKeys.detail(publishedSurvey.id), publishedSurvey);
      
      // Update the survey in the my surveys list
      queryClient.setQueryData(surveyKeys.my(), (old: Survey[] | undefined) => {
        if (!old) return old;
        return old.map(survey => 
          survey.id === publishedSurvey.id ? publishedSurvey : survey
        );
      });
      
      // Invalidate public surveys since this survey might now be public
      queryClient.invalidateQueries({ queryKey: surveyKeys.public() });
      
      toast.success('Survey published successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish survey');
    },
  });
} 