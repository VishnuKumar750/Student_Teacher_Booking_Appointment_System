import { Check, X, MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/axios/axios-api";
import { Button } from "@/components/ui/button";
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
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";

/* ───────── API ───────── */
const approveStudent = async (studentId: string) => {
  const { data } = await api.patch(
    `/user/${studentId}/student?status=approved`,
  );
  return data.data;
};

/* ───────── Component ───────── */
export default function StudentRequest({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: approveStudent,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Student approved");
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err?.response?.data.error ?? "Failed to approve student");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Student request</AlertDialogTitle>
          <AlertDialogDescription>
            Approve or reject this student request.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Reject
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={approveMutation.isPending}
            onClick={() => approveMutation.mutate(studentId)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            {approveMutation.isPending ? "Approving..." : "Accept"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
