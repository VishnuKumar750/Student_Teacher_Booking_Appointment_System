import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
import api from "@/axios/axios-api";
import { useMutation } from "@tanstack/react-query";

type Props = {
  appointmentId: string;
};

// appointment approve
const approveAppointment = async (appointmentId: string) => {
  const { data } = await api.patch(`/appointment/approve/${appointmentId}`);
  return data.data;
};

// appointment cancel
const cancelAppointment = async (appointmentId: string) => {
  const { data } = await api.patch(`/appointment/cancel/${appointmentId}`);
  return data.data;
};

export default function AppointmentRequest({ appointmentId }: Props) {
  // approve mutation
  const approveMutation = useMutation({
    mutationFn: () => approveAppointment(appointmentId),
    onSuccess: () => {
      toast.success("Appointment approved");
    },
    onError: (error: any) => {
      toast.error("Approval failed", {
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  // cancel mutation
  const cancelMutation = useMutation({
    mutationFn: () => cancelAppointment(appointmentId),
    onSuccess: () => {
      toast.success("Appointment cancelled");
    },
    onError: (error: any) => {
      toast.error("Cancellation failed", {
        description: error.response?.data?.message || "Something went wrong",
      });
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
