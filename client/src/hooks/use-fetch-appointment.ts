import {
  fetchMyAppointments,
  fetchTeacherAppointments,
  fetchTeacherPendingAppointments,
} from "@/api/appointment-api";
import {
  fetchPendingAppointments,
  fetchTeacherAnalytics,
} from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const usePendingAppointments = () => {
  return useQuery({
    queryKey: ["appointments", "pendings"],
    queryFn: fetchPendingAppointments,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ["appointments", "approved"],
    queryFn: fetchMyAppointments,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTeacherAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchTeacherAppointments,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useTeacherAnalytics = () => {
  return useQuery({
    queryKey: ["teacher-analytics"],
    queryFn: fetchTeacherAnalytics,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useTeacherPendingAppointments = () => {
  return useQuery({
    queryKey: ["appointments", "pending"],
    queryFn: fetchTeacherPendingAppointments,
    staleTime: 2 * 60 * 1000,
  });
};
