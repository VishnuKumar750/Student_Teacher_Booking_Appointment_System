import { useState } from "react";
import { Edit } from "lucide-react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
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
import type { IUser, TeacherResponse } from "@/api/user-api";

/* ───────── schema ───────── */
const updateTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(6, "Password must be 6 characters").optional(),
  department: z.string().min(1, "Department is required").optional(),
  subject: z.string().min(3, "Subject must be 3 characters").optional(),
});

type UpdateTeacherForm = z.infer<typeof updateTeacherSchema>;
type FormErrors = Partial<Record<keyof UpdateTeacherForm, string>>;

/* ───────── shared keys ───────── */
const FORM_KEYS: readonly (keyof UpdateTeacherForm)[] = [
  "name",
  "email",
  "password",
  "department",
  "subject",
];

/* ───────── api ───────── */
const updateTeacher = async (args: {
  id: string;
  payload: Partial<UpdateTeacherForm>;
}) => {
  const { data } = await api.put(`/admin/teachers/${args.id}`, args.payload);
  return data.data;
};

type TeacherProps = {
  teacherProp: IUser;
};

/* ───────── component ───────── */
export default function UpdateTeacher({ teacherProp }: TeacherProps) {
  const [form, setForm] = useState<UpdateTeacherForm>({
    name: teacherProp.name,
    email: teacherProp.email,
    department: teacherProp.department,
    subject: teacherProp.subject,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending } = useMutation<
    unknown,
    unknown,
    { id: string; payload: Partial<UpdateTeacherForm> }
  >({
    mutationFn: updateTeacher,
    onSuccess: () => toast.success("Teacher updated"),
    onError: () => toast.error("Update failed"),
  });

  /* ───────── helpers ───────── */
  const handleChange = <K extends keyof UpdateTeacherForm>(
    key: K,
    value: UpdateTeacherForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<UpdateTeacherForm> = {};

    FORM_KEYS.forEach((key) => {
      const original = teacherProp[key as keyof TeacherResponse];
      const current = form[key];

      if (current !== original) {
        payload[key] = current;
      }
    });

    if (Object.keys(payload).length === 0) {
      toast.info("No changes made");
      return;
    }

    const parsed = updateTeacherSchema.safeParse(payload);

    if (!parsed.success) {
      const nextErrors: FormErrors = {};

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UpdateTeacherForm;
        nextErrors[field] = issue.message;
      });

      setErrors(nextErrors);
      return;
    }

    mutate({ id: teacherProp._id, payload: parsed.data });
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

        <form className="px-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input
                value={form.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                value={form.email ?? ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </Field>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password ?? ""}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </Field>

            <div className="flex gap-4">
              <Field>
                <Label>Department</Label>
                <Input
                  value={form.department ?? ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                />
              </Field>

              <Field>
                <Label>Subject</Label>
                <Input
                  value={form.subject ?? ""}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />
              </Field>
            </div>
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
