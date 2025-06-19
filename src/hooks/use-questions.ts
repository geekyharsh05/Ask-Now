import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { Question, CreateQuestionRequest } from '@/types';
import { surveyKeys } from './use-surveys';

// Query keys for consistent cache management
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...questionKeys.lists(), { filters }] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: number) => [...questionKeys.details(), id] as const,
  bySurvey: (surveyId: number) => [...questionKeys.all, 'survey', surveyId] as const,
};

// Get questions by survey ID
export function useQuestionsBySurvey(surveyId: number) {
  return useQuery({
    queryKey: questionKeys.bySurvey(surveyId),
    queryFn: () => apiClient.questions.getQuestionsBySurvey(surveyId),
    enabled: !!surveyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get question by ID
export function useQuestion(id: number) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => apiClient.questions.getQuestionById(id),
    enabled: !!id,
  });
}

// Create question mutation
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ surveyId, data }: { surveyId: number; data: CreateQuestionRequest }) => 
      apiClient.questions.createQuestion(surveyId, data),
    onSuccess: (newQuestion, { surveyId }) => {
      // Invalidate questions for this survey
      queryClient.invalidateQueries({ queryKey: questionKeys.bySurvey(surveyId) });
      
      // Add the new question to the cache
      queryClient.setQueryData(questionKeys.detail(newQuestion.id), newQuestion);
      
      // Update the questions list in cache
      queryClient.setQueryData(questionKeys.bySurvey(surveyId), (old: Question[] | undefined) => {
        if (!old) return [newQuestion];
        return [...old, newQuestion].sort((a, b) => a.order - b.order);
      });
      
      // Invalidate survey data since question count changed
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(surveyId) });
      queryClient.invalidateQueries({ queryKey: surveyKeys.my() });
      
      toast.success('Question created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create question');
    },
  });
}

// Update question mutation
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateQuestionRequest }) => 
      apiClient.questions.updateQuestion(id, data),
    onSuccess: (updatedQuestion) => {
      // Update the specific question in cache
      queryClient.setQueryData(questionKeys.detail(updatedQuestion.id), updatedQuestion);
      
      // Get the survey ID from the updated question
      const surveyId = updatedQuestion.surveyId;
      
      // Update the question in the survey's questions list
      queryClient.setQueryData(questionKeys.bySurvey(surveyId), (old: Question[] | undefined) => {
        if (!old) return old;
        return old.map(question => 
          question.id === updatedQuestion.id ? updatedQuestion : question
        ).sort((a, b) => a.order - b.order);
      });
      
      // Invalidate survey data
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(surveyId) });
      
      toast.success('Question updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update question');
    },
  });
}

// Delete question mutation
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.questions.deleteQuestion(id),
    onSuccess: (_, deletedId) => {
      // Remove question from cache
      queryClient.removeQueries({ queryKey: questionKeys.detail(deletedId) });
      
      // Find and update the survey's questions list
      const questionCacheData = queryClient.getQueryData(questionKeys.detail(deletedId)) as Question;
      if (questionCacheData) {
        const surveyId = questionCacheData.surveyId;
        
        queryClient.setQueryData(questionKeys.bySurvey(surveyId), (old: Question[] | undefined) => {
          if (!old) return old;
          return old.filter(question => question.id !== deletedId);
        });
        
        // Invalidate survey data since question count changed
        queryClient.invalidateQueries({ queryKey: surveyKeys.detail(surveyId) });
        queryClient.invalidateQueries({ queryKey: surveyKeys.my() });
      }
      
      toast.success('Question deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete question');
    },
  });
}

// Add option to question mutation
export function useAddOptionToQuestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ questionId, optionText }: { questionId: number; optionText: string }) => 
      apiClient.questions.addOptionToQuestion(questionId, optionText),
    onSuccess: (newOption, { questionId }) => {
      // Invalidate the question to refetch with new option
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(questionId) });
      
      // Also invalidate the survey's questions list
      const questionData = queryClient.getQueryData(questionKeys.detail(questionId)) as Question;
      if (questionData) {
        queryClient.invalidateQueries({ queryKey: questionKeys.bySurvey(questionData.surveyId) });
      }
      
      toast.success('Option added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add option');
    },
  });
} 