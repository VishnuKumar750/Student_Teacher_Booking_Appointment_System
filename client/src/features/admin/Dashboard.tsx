import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, GraduationCap, Calendar } from "lucide-react";

const fetchAdminAnalytics = async () => {
  const { data } = await api.get("/admin/analytics");
  return data.data;
};

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAdminAnalytics,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          System overview and appointment analytics
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading analytics
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-20 text-red-500">
          {(error as any)?.response?.data?.message ||
            "Failed to load analytics"}
        </div>
      )}

      {/* Dashboard */}
      {!isLoading && !isError && data && (
        <>
          {/* Users Section */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Users</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.users.total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Students</CardTitle>
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.users.students}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Teachers</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.users.teachers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Section */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Appointments</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.appointments.total}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-500">
                  {data.appointments.breakdown.pending || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {data.appointments.breakdown.approved || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancelled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-500">
                  {data.appointments.breakdown.cancelled || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
