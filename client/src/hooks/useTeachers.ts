import { fetchTeachers } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
    staleTime: 5 * 60 * 1000,
  });
};
