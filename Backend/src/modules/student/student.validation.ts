import { z } from "zod";

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    rollNo: z.string().min(1),
    department: z.string().min(1),
    course: z.string().min(1),
    year: z.string().min(1),

    // optional (can be generated on backend)
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    teacherId: z.string().optional(),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    rollNo: z.string().optional(),
    department: z.string().optional(),
    course: z.string().optional(),
    year: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    isApproved: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
