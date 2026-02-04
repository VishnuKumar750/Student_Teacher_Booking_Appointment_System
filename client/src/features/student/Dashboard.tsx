import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarCheck, Clock, XCircle } from "lucide-react";

const fetchStudentAnalytics = async () => {
  const { data } = await api.get("/student/analytics");
  return data.data;
};

export default function StudentAnalyticsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-analytics"],
    queryFn: fetchStudentAnalytics,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track your appointment requests
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading analytics
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 py-20">
          {(error as any)?.response?.data?.message ||
            "Failed to load analytics"}
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {data.total}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {data.pending}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Approved</CardTitle>
              <CalendarCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {data.approved}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {data.cancelled}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {data.upcoming}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
