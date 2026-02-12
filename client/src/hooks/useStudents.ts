import { fetchStudents, fetchTeacherStudents } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTeacherStudents = () => {
  return useQuery({
    queryKey: ["teacher-students"],
    queryFn: fetchTeacherStudents,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
