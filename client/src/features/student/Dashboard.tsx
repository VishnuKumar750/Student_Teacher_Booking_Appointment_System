import { Loader2 } from "lucide-react";
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";
import { useStudentAnalytics } from "@/hooks/useStudentAnalytics";
import StudentAnalyticsHeader from "@/components/user/student/student-analytics-header";
import StudentAnalyticsCards from "@/components/user/student/student-analytics-card";

export default function StudentAnalyticsPage() {
  const { data, isLoading, isError, error } = useStudentAnalytics();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <StudentAnalyticsHeader />

      {isLoading && (
        <div className="flex justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading analytics
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 py-20">
          {(error as AxiosError<ApiError>)?.response?.data?.message ||
            "Failed to load analytics"}
        </div>
      )}

      {data && !isLoading && !isError && <StudentAnalyticsCards data={data} />}
    </div>
  );
}
