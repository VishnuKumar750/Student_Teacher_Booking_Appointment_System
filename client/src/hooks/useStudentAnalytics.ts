import { fetchStudentAnalytics } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const useStudentAnalytics = () => {
  return useQuery({
    queryKey: ["student-analytics"],
    queryFn: fetchStudentAnalytics,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
