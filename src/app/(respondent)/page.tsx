"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAvailableSurveys } from "@/hooks/use-public-surveys";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { Survey } from "@/types";

export default function RespondentDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Respondent Dashboard</h1>
      <p>
        Welcome to the respondent dashboard! This is a test page to debug the
        4000 error.
      </p>
    </div>
  );
}
