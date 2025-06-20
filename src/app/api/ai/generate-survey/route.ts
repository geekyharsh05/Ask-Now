import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SurveyGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(z.object({
    text: z.string(),
    description: z.string().optional(),
    type: z.enum(['TEXT', 'MULTIPLE_CHOICE', 'RADIO', 'CHECKBOX', 'RATING', 'DATE', 'EMAIL', 'NUMBER']),
    isRequired: z.boolean(),
    options: z.array(z.object({
      text: z.string(),
    })).optional(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const { topic, numberOfQuestions = 5, targetAudience = 'general public' } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: SurveyGenerationSchema,
      prompt: `Create a comprehensive survey about "${topic}" with ${numberOfQuestions} questions for ${targetAudience}.

Requirements:
- Generate a compelling title and description for the survey
- Create ${numberOfQuestions} diverse, well-crafted questions
- Use different question types (TEXT, MULTIPLE_CHOICE, RADIO, CHECKBOX, RATING, DATE, EMAIL, NUMBER) appropriately
- For choice-based questions (MULTIPLE_CHOICE, RADIO, CHECKBOX), provide 3-5 relevant options
- Mix required and optional questions strategically
- Ensure questions are clear, unbiased, and relevant to the topic
- Questions should flow logically and gather meaningful insights

Topic: ${topic}
Target Audience: ${targetAudience}
Number of Questions: ${numberOfQuestions}

The survey should be professional and engaging for the target audience.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error('AI survey generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate survey. Please try again.' },
      { status: 500 }
    );
  }
} 