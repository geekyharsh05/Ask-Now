import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface GenerateSurveyRequest {
  topic: string;
  numberOfQuestions?: number;
  targetAudience?: string;
}

interface GeneratedQuestion {
  text: string;
  description?: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'RADIO' | 'CHECKBOX' | 'RATING' | 'DATE' | 'EMAIL' | 'NUMBER';
  isRequired: boolean;
  options?: { text: string }[];
}

interface GeneratedSurvey {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

export const useGenerateAISurvey = () => {
  return useMutation<GeneratedSurvey, Error, GenerateSurveyRequest>({
    mutationFn: async (data) => {
      const response = await axios.post('/api/ai/generate-survey', data);
      return response.data;
    },
  });
}; 