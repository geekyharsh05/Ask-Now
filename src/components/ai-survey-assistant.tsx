"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  Wand2,
  Users,
  MessageSquare,
  Target,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AIAssistantProps {
  onSurveyGenerated: (survey: {
    title: string;
    description: string;
    questions: Array<{
      id: string;
      type: any;
      text: string;
      description?: string;
      isRequired: boolean;
      order: number;
      options?: { id: string; text: string; order: number }[];
    }>;
  }) => void;
}

interface AIFormData {
  topic: string;
  numberOfQuestions: number;
  targetAudience: string;
  additionalContext?: string;
}

// Mock hook for demonstration
const useGenerateAISurvey = () => ({
  mutateAsync: async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      title: `${data.topic} Survey`,
      description: `A comprehensive survey about ${data.topic.toLowerCase()} designed for ${data.targetAudience}.`,
      questions: Array.from({ length: data.numberOfQuestions }, (_, i) => ({
        type: i % 3 === 0 ? "multiple_choice" : i % 3 === 1 ? "text" : "rating",
        text: `Question ${i + 1} about ${data.topic}?`,
        description: `This question helps us understand your perspective on ${data.topic.toLowerCase()}.`,
        isRequired: true,
        options:
          i % 3 === 0
            ? [
                { text: "Excellent" },
                { text: "Good" },
                { text: "Fair" },
                { text: "Poor" },
              ]
            : undefined,
      })),
    };
  },
  isPending: false,
});

export function AISurveyAssistant({ onSurveyGenerated }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AIFormData>({
    defaultValues: {
      numberOfQuestions: 5,
      targetAudience: "general public",
    },
  });

  const generateSurveyMutation = useGenerateAISurvey();
  const watchedValues = watch();

  const onSubmit = async (data: AIFormData) => {
    try {
      const result = await generateSurveyMutation.mutateAsync({
        topic: data.topic,
        numberOfQuestions: data.numberOfQuestions,
        targetAudience: data.targetAudience,
      });

      // Transform AI result to local format
      const transformedSurvey = {
        title: result.title,
        description: result.description,
        questions: result.questions.map((question, index) => ({
          id: `ai-q-${Date.now()}-${index}`,
          type: question.type,
          text: question.text,
          description: question.description,
          isRequired: question.isRequired,
          order: index,
          options: question.options?.map((option, optIndex) => ({
            id: `ai-opt-${Date.now()}-${index}-${optIndex}`,
            text: option.text,
            order: optIndex,
          })),
        })),
      };

      onSurveyGenerated(transformedSurvey);
      setIsOpen(false);
      reset();
      toast.success(
        "AI survey generated successfully! Review and customize as needed."
      );
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error?.response?.data?.error || "Failed to generate survey");
    }
  };

  const questionTypeExamples = [
    {
      type: "Multiple Choice",
      icon: "📊",
      description: "Select from predefined options",
    },
    {
      type: "Text Response",
      icon: "✍️",
      description: "Open-ended written answers",
    },
    {
      type: "Rating Scale",
      icon: "⭐",
      description: "Rate on a numerical scale",
    },
    { type: "Yes/No", icon: "✅", description: "Simple binary choices" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 mr-3">
              <Wand2 className="h-6 w-6 text-purple-600" />
            </div>
            AI Survey Assistant
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground text-center">
            Transform your ideas into professional surveys with AI-powered
            question generation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Form Card */}
          <Card className="border-2 border-dashed">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-600" />
                Survey Configuration
              </CardTitle>
              <CardDescription className="text-base">
                Tell us about your survey and we'll create tailored questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="topic"
                  className="text-sm font-semibold flex items-center"
                >
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Survey Topic *
                </Label>
                <Input
                  id="topic"
                  {...register("topic", { required: "Topic is required" })}
                  placeholder="e.g., Customer satisfaction, Employee engagement, Market research, Product feedback..."
                  className="h-12 text-base border-2 focus:border-purple-400 transition-colors"
                />
                {errors.topic && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.topic.message}
                  </p>
                )}
              </div>

              {/* Grid for Number and Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="numberOfQuestions"
                    className="text-sm font-semibold"
                  >
                    Number of Questions
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("numberOfQuestions", Number.parseInt(value))
                    }
                    defaultValue="5"
                  >
                    <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">
                        3 questions (Quick survey)
                      </SelectItem>
                      <SelectItem value="5">5 questions (Standard)</SelectItem>
                      <SelectItem value="8">8 questions (Detailed)</SelectItem>
                      <SelectItem value="10">
                        10 questions (Comprehensive)
                      </SelectItem>
                      <SelectItem value="15">
                        15 questions (In-depth)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="targetAudience"
                    className="text-sm font-semibold flex items-center"
                  >
                    <Users className="mr-1 h-4 w-4" />
                    Target Audience
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("targetAudience", value)}
                    defaultValue="general public"
                  >
                    <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general public">
                        🌍 General Public
                      </SelectItem>
                      <SelectItem value="customers">🛒 Customers</SelectItem>
                      <SelectItem value="employees">👥 Employees</SelectItem>
                      <SelectItem value="students">🎓 Students</SelectItem>
                      <SelectItem value="professionals">
                        💼 Professionals
                      </SelectItem>
                      <SelectItem value="teenagers">🧑‍🎓 Teenagers</SelectItem>
                      <SelectItem value="seniors">👴 Seniors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Context */}
              <div className="space-y-2">
                <Label
                  htmlFor="additionalContext"
                  className="text-sm font-semibold flex items-center"
                >
                  <Lightbulb className="mr-1 h-4 w-4" />
                  Additional Context (Optional)
                </Label>
                <Textarea
                  id="additionalContext"
                  {...register("additionalContext")}
                  placeholder="Specific requirements, focus areas, industry context, or any other details that would help generate better questions..."
                  rows={4}
                  className="border-2 focus:border-purple-400 transition-colors resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Tip: More context leads to more relevant and targeted
                  questions
                </p>
              </div>
            </CardContent>
          </Card>


          <DialogFooter className="pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={generateSurveyMutation.isPending}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={generateSurveyMutation.isPending}
              className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {generateSurveyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Survey...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Survey
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
