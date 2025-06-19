"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  useAnalyticsOverview,
  useTimeSeriesAnalytics,
  useQuestionTypeAnalytics,
  useResponseRateTrends,
  useSurveyAnalytics,
} from "@/hooks/use-analytics";
import { useMySurveys } from "@/hooks/use-surveys";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Target,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

// Chart colors
const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  tertiary: "#f59e0b",
  quaternary: "#ef4444",
  accent: "#8b5cf6",
  muted: "#6b7280",
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.tertiary,
  COLORS.quaternary,
  COLORS.accent,
];

export default function AnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "quarter">(
    "month"
  );
  const [selectedSurvey, setSelectedSurvey] = useState<number | null>(null);

  // Get URL parameters
  const urlTab = searchParams.get("tab") || "overview";

  // Get current session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await authClient.getSession();
      return result;
    },
  });

  // Analytics data hooks
  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useAnalyticsOverview();
  const { data: timeSeries, isLoading: timeSeriesLoading } =
    useTimeSeriesAnalytics(timePeriod);
  const { data: questionTypes, isLoading: questionTypesLoading } =
    useQuestionTypeAnalytics();
  const { data: responseRates, isLoading: responseRatesLoading } =
    useResponseRateTrends();
  const { data: surveys, isLoading: surveysLoading } = useMySurveys();
  const { data: surveyAnalytics, isLoading: surveyAnalyticsLoading } =
    useSurveyAnalytics(selectedSurvey || 0);

  const user = session?.data?.user;
  const isAuthenticated = !!session?.data?.session;

  // Redirect if not authenticated
  if (!sessionLoading && !isAuthenticated) {
    router.push("/signin");
    return null;
  }

  if (sessionLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    refetchOverview();
  };

  const handleExportData = () => {
    // Mock export functionality
    const data = {
      overview,
      timeSeries,
      questionTypes,
      responseRates,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Analytics Dashboard
            </h2>
            <p className="text-muted-foreground">
              Comprehensive insights into your survey performance and user
              engagement
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                overview?.totalSurveys || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.statusDistribution.published || 0} published,{" "}
              {overview?.statusDistribution.draft || 0} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                overview?.totalResponses || 0
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {overview?.growthRate !== undefined && (
                <>
                  {overview.growthRate > 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={
                      overview.growthRate > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {overview.growthRate > 0 ? "+" : ""}
                    {overview.growthRate}%
                  </span>
                  <span className="ml-1">this week</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                `${overview?.avgResponseRate || 0}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.activeNow || 0} active surveys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Completion Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                `${Math.floor((overview?.avgCompletionTime || 0) / 60)}m ${(overview?.avgCompletionTime || 0) % 60}s`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average time per response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue={urlTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="surveys">Survey Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Response Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Response Distribution</CardTitle>
                <CardDescription>Breakdown of response types</CardDescription>
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Registered",
                            value:
                              overview?.responseDistribution.registered || 0,
                          },
                          {
                            name: "Anonymous",
                            value:
                              overview?.responseDistribution.anonymous || 0,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          {
                            name: "Registered",
                            value:
                              overview?.responseDistribution.registered || 0,
                          },
                          {
                            name: "Anonymous",
                            value:
                              overview?.responseDistribution.anonymous || 0,
                          },
                        ].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Survey Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Status</CardTitle>
                <CardDescription>
                  Distribution of survey statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        {
                          status: "Published",
                          count: overview?.statusDistribution.published || 0,
                        },
                        {
                          status: "Draft",
                          count: overview?.statusDistribution.draft || 0,
                        },
                        {
                          status: "Closed",
                          count: overview?.statusDistribution.closed || 0,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Question Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Question Types Usage</CardTitle>
              <CardDescription>
                Distribution of question types across your surveys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questionTypesLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={questionTypes || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="type"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select
              value={timePeriod}
              onValueChange={(value: "week" | "month" | "quarter") =>
                setTimePeriod(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Response Trends</CardTitle>
              <CardDescription>
                Daily response and survey creation trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeSeriesLoading ? (
                <Skeleton className="h-80" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeSeries || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        format(new Date(value), "MMM dd")
                      }
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(value) =>
                        format(new Date(value), "PPPP")
                      }
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="responses"
                      stackId="1"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.6}
                      name="Responses"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="surveys"
                      stackId="2"
                      stroke={COLORS.secondary}
                      fill={COLORS.secondary}
                      fillOpacity={0.6}
                      name="Surveys Created"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Response Rate Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Performance</CardTitle>
              <CardDescription>Response rates for your surveys</CardDescription>
            </CardHeader>
            <CardContent>
              {responseRatesLoading ? (
                <Skeleton className="h-80" />
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={responseRates?.slice(0, 10) || []}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="title" width={150} />
                      <Tooltip />
                      <Bar dataKey="responseRate" fill={COLORS.tertiary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Survey Analytics Tab */}
        <TabsContent value="surveys" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select
              value={selectedSurvey?.toString() || ""}
              onValueChange={(value) =>
                setSelectedSurvey(value ? parseInt(value) : null)
              }
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a survey" />
              </SelectTrigger>
              <SelectContent>
                {surveys?.map((survey) => (
                  <SelectItem key={survey.id} value={survey.id.toString()}>
                    {survey.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSurvey && surveyAnalytics ? (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Survey Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>{surveyAnalytics.title}</CardTitle>
                  <CardDescription>Survey performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {surveyAnalytics.totalResponses}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total Responses
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {surveyAnalytics.completionRate}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Completion Rate
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.floor(surveyAnalytics.avgResponseTime / 60)}m{" "}
                        {surveyAnalytics.avgResponseTime % 60}s
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Avg. Response Time
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {surveyAnalytics.demographics.uniqueIPs}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Unique IPs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Demographics</CardTitle>
                  <CardDescription>
                    Breakdown of respondent types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Registered",
                            value: surveyAnalytics.demographics.registered,
                          },
                          {
                            name: "Anonymous",
                            value: surveyAnalytics.demographics.anonymous,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          {
                            name: "Registered",
                            value: surveyAnalytics.demographics.registered,
                          },
                          {
                            name: "Anonymous",
                            value: surveyAnalytics.demographics.anonymous,
                          },
                        ].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Drop-off Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Drop-off Analysis</CardTitle>
                  <CardDescription>
                    Questions with highest abandonment rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {surveyAnalytics.dropOffPoints.map((point, index) => (
                      <div
                        key={point.questionId}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {point.questionText}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Question ID: {point.questionId}
                          </p>
                        </div>
                        <Badge
                          variant={
                            point.dropOffRate > 15 ? "destructive" : "secondary"
                          }
                        >
                          {point.dropOffRate}% drop-off
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Best Performing Questions */}
              <Card>
                <CardHeader>
                  <CardTitle>Best Performing Questions</CardTitle>
                  <CardDescription>
                    Questions with highest engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {surveyAnalytics.bestPerformingQuestions.map(
                      (question, index) => (
                        <div
                          key={question.questionId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium truncate">
                              {question.questionText}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Question ID: {question.questionId}
                            </p>
                          </div>
                          <Badge variant="default">
                            {question.engagementScore}% engagement
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">Select a Survey</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a survey from the dropdown to view detailed analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  AI-powered insights from your survey data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        Your response rates are {overview?.growthRate || 0}%
                        higher this week
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Consider promoting successful survey formats
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        Average completion time is{" "}
                        {Math.floor((overview?.avgCompletionTime || 0) / 60)}{" "}
                        minutes
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Optimal range is 3-5 minutes for best engagement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                      <Users className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        {(
                          ((overview?.responseDistribution.anonymous || 0) /
                            (overview?.totalResponses || 1)) *
                          100
                        ).toFixed(1)}
                        % of responses are anonymous
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Consider encouraging registration for better insights
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Actionable suggestions to improve performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">
                      Optimize Question Order
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Place engaging questions early to reduce drop-off rates
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">Reduce Survey Length</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Consider splitting long surveys into multiple shorter ones
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">
                      Improve Mobile Experience
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ensure all question types work well on mobile devices
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">Use Visual Elements</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add rating scales and multiple choice for better
                      engagement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {overview?.avgResponseRate || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {overview?.avgResponseRate && overview.avgResponseRate > 15
                      ? "Excellent"
                      : "Good"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {overview?.totalQuestions || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg{" "}
                    {Math.round(
                      (overview?.totalQuestions || 0) /
                        (overview?.totalSurveys || 1)
                    )}{" "}
                    per survey
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {overview?.activeNow || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active Surveys
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently collecting responses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
