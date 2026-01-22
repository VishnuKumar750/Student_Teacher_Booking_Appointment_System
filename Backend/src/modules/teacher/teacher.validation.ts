import z from "zod";

// create teacher schema
export const createTeacherSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
    department: z.string().min(1),
    subject: z.string().min(1),
  }),
});

// update teacher
export const updateTeacherSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    department: z.string().optional(),
    subject: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
