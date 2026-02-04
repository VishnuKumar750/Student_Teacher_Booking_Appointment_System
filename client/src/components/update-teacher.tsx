import { Edit } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { TimeRangePicker } from "./time-picker";
import api from "@/axios/axios-api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

/* ───────── schema ───────── */
const updateTeacherSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    department: z.string().min(1).optional(),
    subject: z.string().min(3).optional(),
    availability: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.availability) {
      if (data.availability.start >= data.availability.end) {
        ctx.addIssue({
          path: ["availability", "end"],
          message: "End time must be after start time",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type UpdateTeacherForm = z.infer<typeof updateTeacherSchema>;

/* ───────── api ───────── */
const updateTeacher = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<UpdateTeacherForm>;
}) => {
  const { data } = await api.put(`/admin/teachers/${id}`, payload);
  return data.data;
};

/* ───────── component ───────── */
export default function UpdateTeacher({
  teacherId,
  teacher,
}: {
  teacherId: string;
  teacher: UpdateTeacherForm;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<UpdateTeacherForm>({
    resolver: zodResolver(updateTeacherSchema),
    defaultValues: {
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      subject: teacher.subject,
      availability: teacher.availability,
    },
  });

  const availability = watch("availability");

  const { mutate, isPending } = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => toast.success("Teacher updated"),
    onError: () => toast.error("Update failed"),
  });

  const onSubmit = (formData: UpdateTeacherForm) => {
    // 🔥 build payload only from changed fields
    const payload: Partial<UpdateTeacherForm> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const typedKey = key as keyof UpdateTeacherForm;
      payload[typedKey] = formData[typedKey];
    });

    // password safety
    if (!payload.password) delete payload.password;

    // availability safety
    if (
      payload.availability &&
      (!payload.availability.start || !payload.availability.end)
    ) {
      delete payload.availability;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes made");
      return;
    }

    mutate({ id: teacherId, payload });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Edit className="w-4 h-4" />
          Edit Teacher
        </Button>
      </SheetTrigger>

      <SheetContent className="min-h-svh overflow-auto">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Update details and save changes.</SheetDescription>
        </SheetHeader>

        <form className="px-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input {...register("name")} />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input {...register("email")} />
            </Field>

            <Field>
              <Label>Password</Label>
              <Input type="password" {...register("password")} />
            </Field>

            <div className="flex gap-4">
              <Field>
                <Label>Department</Label>
                <Input {...register("department")} />
              </Field>

              <Field>
                <Label>Subject</Label>
                <Input {...register("subject")} />
              </Field>
            </div>

            <Field className="mb-6">
              <Label>Availability</Label>
              <TimeRangePicker
                value={{
                  startTime: availability?.start || "",
                  endTime: availability?.end || "",
                }}
                onChange={({ startTime, endTime }) => {
                  setValue(
                    "availability",
                    { start: startTime, end: endTime },
                    { shouldDirty: true, shouldValidate: true },
                  );
                }}
              />
              {errors.availability?.end && (
                <p className="text-xs text-destructive">
                  {errors.availability.end.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
