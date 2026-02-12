import { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CirclePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { TimeRangePicker } from "./time-picker";
import api from "@/axios/axios-api";
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";

/* ───────── schema ───────── */
const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
  department: z.string().min(1, "Department is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  availability: z.object({
    start: z.string().min(1, "Start time required"),
    end: z.string().min(1, "End time required"),
  }),
});

type TeacherForm = z.infer<typeof teacherSchema>;
type FormErrors = Partial<Record<string, string>>;

/* ───────── api ───────── */
const createTeacher = async (payload: TeacherForm) => {
  const { data } = await api.post("/user/admin/teachers", payload);
  return data;
};

export default function AddTeacher({ refresh }: { refresh: () => void }) {
  const [form, setForm] = useState<TeacherForm>({
    name: "",
    email: "",
    password: "",
    department: "",
    subject: "",
    availability: { start: "", end: "" },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending } = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      toast.success("Teacher created");
      setForm({
        name: "",
        email: "",
        password: "",
        department: "",
        subject: "",
        availability: { start: "", end: "" },
      });
      setErrors({});
      refresh();
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    },
  });

  /* ───────── helpers ───────── */
  const setField = <K extends keyof TeacherForm>(
    key: K,
    value: TeacherForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = teacherSchema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: FormErrors = {};

      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path.join(".")] = issue.message;
      });

      setErrors(nextErrors);
      return;
    }

    mutate(parsed.data);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <CirclePlus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </SheetTrigger>

      <SheetContent className="p-4 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input
                  value={form.department}
                  onChange={(e) => setField("department", e.target.value)}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Input
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                />
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>Availability</FieldLabel>
                <TimeRangePicker
                  value={{
                    startTime: form.availability.start,
                    endTime: form.availability.end,
                  }}
                  onChange={({ startTime, endTime }) =>
                    setForm((prev) => ({
                      ...prev,
                      availability: { start: startTime, end: endTime },
                    }))
                  }
                />
                {errors["availability.start"] && (
                  <p className="text-sm text-red-500">
                    {errors["availability.start"]}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Create Teacher"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
