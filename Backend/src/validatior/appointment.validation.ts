import { z } from "zod";

export const createAppointmentSchema = z.object({
  body: z.object({
    studentId: z.string().min(1),
    teacherId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    slot: z.string().min(1),
    message: z.string().min(1),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "CANCELLED"]),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
