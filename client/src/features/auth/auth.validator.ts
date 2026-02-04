import { z } from "zod";

export const studentRegisterSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    department: z.string().min(2, "Department is required"),
    year: z
      .number()
      .refine(
        (val) => Number.isInteger(val) && val <= new Date().getFullYear(),
        { message: "Invalid year" },
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StudentRegisterForm = z.infer<typeof studentRegisterSchema>;
