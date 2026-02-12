import { fetchPendingStudents } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const usePendingStudents = () => {
  return useQuery({
    queryKey: ["students", "pending"],
    queryFn: fetchPendingStudents,
    staleTime: 2 * 60 * 1000,
  });
};
