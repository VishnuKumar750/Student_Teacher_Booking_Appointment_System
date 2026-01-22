import { z } from "zod";

const departmentSchema = z.object({
  title: z.string().min(1, "Department title is required"),
});

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
});

export const createAcademicSchema = z.object({
  body: z.object({
    department: z
      .array(departmentSchema)
      .min(1, "At least one department required"),
    course: z.array(courseSchema).min(1, "At least one course required"),
    isActive: z.boolean().optional(),
  }),
});

export const updateAcademicSchema = z.object({
  body: z.object({
    department: z.array(departmentSchema).optional(),
    course: z.array(courseSchema).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Id is required"),
  }),
});
