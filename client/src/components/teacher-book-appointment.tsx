import { useState } from "react";
import { Calendar, CalendarCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

/* ───────── types ───────── */
type TimeSlot = {
  start: string;
  end: string;
};

type BookAppointmentPayload = {
  studentId: string;
  date: string;
  start: string;
  end: string;
  purpose: string;
};

/* ───────── api ───────── */
const fetchAvailableSlots = async (
  studentId: string,
  date: string,
): Promise<TimeSlot[]> => {
  if (!studentId || !date) return [];

  const { data } = await api.get(
    `/appointment/student/${studentId}/availability?date=${date}`,
  );

  return Array.isArray(data?.data) ? data.data : [];
};

const bookAppointment = async (payload: BookAppointmentPayload) => {
  const { data } = await api.post("/appointment/book/teacher", payload);
  return data;
};

/* ───────── component ───────── */
export const TeacherBookAppointment = ({
  studentId,
}: {
  studentId: string;
}) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>();

  /* ───── availability query ───── */
  const {
    data: availableSlots = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-availability", studentId, date],
    queryFn: () => fetchAvailableSlots(studentId, date),
    enabled: Boolean(studentId && date),
  });

  /* ───── booking mutation ───── */
  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      toast.success("Appointment request sent");
      setOpen(false);
      setDate("");
      setPurpose("");
      setSelectedSlot(undefined);

      queryClient.invalidateQueries({
        queryKey: ["teacher-appointments"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to book appointment",
      );
    },
  });

  /* ───── submit ───── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    bookMutation.mutate({
      studentId,
      date,
      start: selectedSlot.start,
      end: selectedSlot.end,
      purpose,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarCheck className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Choose a date and an available time slot to request an appointment.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            {/* Date + Slot */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
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

              <Field className="flex-1">
                <FieldLabel>Available Time Slot</FieldLabel>

                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading slots…
                  </p>
                )}

                {isError && (
                  <p className="text-sm text-red-500">Failed to load slots</p>
                )}

                {!isLoading &&
                  !isError &&
                  date &&
                  availableSlots.length === 0 && (
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

            {/* Purpose */}
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

          {/* Footer */}
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
