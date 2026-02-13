import { useState } from "react";
import { Calendar, CalendarCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { IntervalSelect } from "./interval-select";
import api from "@/axios/axios-api";
import type { ApiError } from "@/Types/api-error";
import { useAuth } from "@/hooks/use-auth";

/* ───────── types ───────── */
type TimeSlot = {
  start: string;
  end: string;
};

type FetchSlotsParams = {
  teacherId: string;
  studentId: string;
  date: string;
};

/* ───────── api ───────── */
const fetchAvailableSlots = async ({
  teacherId,
  studentId,
  date,
}: FetchSlotsParams): Promise<TimeSlot[]> => {
  if (!teacherId || !studentId || !date) return [];

  const { data } = await api.get("/appointment/available-slot", {
    params: { teacherId, studentId, date },
  });

  return Array.isArray(data?.data) ? data.data : [];
};

const bookAppointment = async ({
  params,
  payload,
}: {
  params: { teacherId: string; studentId: string };
  payload: {
    date: string;
    start: string;
    end: string;
    purpose: string;
  };
}) => {
  const { data } = await api.post("/appointment/book-appointment", payload, {
    params,
  });
  return data;
};

/* ───────── component ───────── */
export const TeacherBookAppointment = ({
  studentId,
}: {
  studentId: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>();

  const teacherId = user?.id;

  /* ───── availability query ───── */
  const {
    data: availableSlots = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["available-slots", teacherId, studentId, date],
    queryFn: () =>
      fetchAvailableSlots({
        teacherId: teacherId!,
        studentId,
        date,
      }),
    enabled: Boolean(teacherId && studentId && date),
  });

  /* ───── booking mutation ───── */
  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Appointment request sent");

      setOpen(false);
      setDate("");
      setPurpose("");
      setSelectedSlot(undefined);

      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.error || "Failed to book appointment");
    },
  });

  /* ───── submit ───── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    bookMutation.mutate({
      params: { teacherId: teacherId!, studentId },
      payload: {
        date,
        start: selectedSlot.start,
        end: selectedSlot.end,
        purpose,
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setDate("");
          setPurpose("");
          setSelectedSlot(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarCheck className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Choose a date and an available time slot.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <div className="flex flex-col gap-4">
              <Field>
                <FieldLabel>Date</FieldLabel>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-9"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedSlot(undefined);
                    }}
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Available Time Slot</FieldLabel>

                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading slots…
                  </p>
                )}

                {isError && (
                  <p className="text-sm text-red-500">Failed to load slots</p>
                )}

                {!isLoading && !isError && date && !availableSlots.length && (
                  <p className="text-sm text-muted-foreground">
                    No slots available
                  </p>
                )}

                {!isLoading && availableSlots.length > 0 && (
                  <IntervalSelect
                    intervals={availableSlots}
                    value={selectedSlot}
                    onChange={setSelectedSlot}
                  />
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Purpose</FieldLabel>
              <Textarea
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Explain briefly why you want to meet"
                required
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={bookMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!date || !selectedSlot || bookMutation.isPending}
            >
              {bookMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
