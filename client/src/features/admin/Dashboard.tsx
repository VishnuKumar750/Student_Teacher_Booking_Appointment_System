import AdminHeader from "@/components/user/Admin/admin-header";
import AppointmentsAnalytics from "@/components/user/Admin/appointments-analytics";
import UsersAnalytics from "@/components/user/Admin/user-anlaytics";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import type { ApiError } from "@/Types/api-error";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError, error } = useAdminAnalytics();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <AdminHeader />

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading analytics
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500">
          {(error as AxiosError<ApiError>)?.response?.data?.error ||
            "Failed to load analytics"}
        </div>
      )}

      {data && (
        <>
          <UsersAnalytics users={data.users} />
          <AppointmentsAnalytics appointments={data.appointments} />
        </>
      )}
    </div>
  );
}
