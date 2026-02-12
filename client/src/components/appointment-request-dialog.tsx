import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";
import { approveAppointment, cancelAppointment } from "@/api/appointment-api";

type Props = {
  appointmentId: string;
};

export default function AppointmentRequest({ appointmentId }: Props) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => approveAppointment(appointmentId),
    onSuccess: () => {
      toast.success("Appointment approved");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error || "Approval failed");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelAppointment(appointmentId),
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error || "Cancellation failed");
    },
  });

  const isLoading = approveMutation.isPending || cancelMutation.isPending;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Appointment Action
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Appointment action</AlertDialogTitle>
          <AlertDialogDescription>
            You can approve or cancel this appointment. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={() => cancelMutation.mutate()}
          >
            {cancelMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Cancel"
            )}
          </AlertDialogAction>

          <AlertDialogAction
            disabled={isLoading}
            onClick={() => approveMutation.mutate()}
          >
            {approveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Accept"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
