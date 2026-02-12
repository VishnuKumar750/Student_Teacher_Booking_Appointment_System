import { fetchTeachersForStudent } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const useStudentTeachers = () => {
  return useQuery({
    queryKey: ["student-teachers"],
    queryFn: fetchTeachersForStudent,
    staleTime: 5 * 60 * 1000,
  });
};
