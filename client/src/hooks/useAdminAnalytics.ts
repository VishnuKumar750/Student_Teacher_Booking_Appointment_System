import { fetchAdminAnalytics } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAdminAnalytics,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
