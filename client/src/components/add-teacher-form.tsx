import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CirclePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { TimeRangePicker } from "./time-picker";
import api from "@/axios/axios-api";

/* ───────── schema ───────── */
const teacherSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  department: z.string().min(1),
  subject: z.string().min(3),
  availability: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

type TeacherForm = z.infer<typeof teacherSchema>;

export default function AddTeacher({ refresh }: { refresh: () => void }) {
  const { register, handleSubmit, watch, setValue, reset } =
    useForm<TeacherForm>({
      resolver: zodResolver(teacherSchema),
      defaultValues: {
        availability: { start: "", end: "" },
      },
    });

  const availability = watch("availability");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TeacherForm) => api.post("/admin/teachers", data),
    onSuccess: () => {
      toast.success("Teacher created");
      reset();
      refresh();
    },
    onError: (err) =>
      toast.error(err?.response?.error?.message || "something went wrong"),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <CirclePlus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </SheetTrigger>

      <SheetContent className="p-4 overflow-auto">
        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="space-y-4 mt-6"
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input {...register("name")} />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input {...register("email")} />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" {...register("password")} />
              </Field>

              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input {...register("department")} />
              </Field>

              <Field>
                <FieldLabel>Subjects</FieldLabel>
                <Input {...register("subject")} />
              </Field>

              <Field>
                <FieldLabel>Availability</FieldLabel>
                <TimeRangePicker
                  value={{
                    startTime: availability.start,
                    endTime: availability.end,
                  }}
                  onChange={({ startTime, endTime }) => {
                    setValue("availability.start", startTime, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("availability.end", endTime, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
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
