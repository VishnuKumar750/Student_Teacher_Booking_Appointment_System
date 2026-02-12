import { Loader2 } from "lucide-react";
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";
import { useTeacherAnalytics } from "@/hooks/use-fetch-appointment";
import TeacherAnalyticsHeader from "@/components/user/teacher/teacher-analytics-header";
import TeacherAnalyticsCards from "@/components/user/teacher/teacher-analytics-cards";

export default function TeacherAnalyticsPage() {
  const { data, isLoading, isError, error } = useTeacherAnalytics();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <TeacherAnalyticsHeader />

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

      {data && !isLoading && !isError && <TeacherAnalyticsCards data={data} />}
    </div>
  );
}
