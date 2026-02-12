import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import api from "@/axios/axios-api";
import { YearSelect } from "@/components/year-select";
import {
  studentRegisterSchema,
  type StudentRegisterForm,
} from "./auth.validator";
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";

/* ───────── API ───────── */

const registerStudent = async (payload: StudentRegisterForm) => {
  const { data } = await api.post("/auth/signup", {
    name: payload.name,
    email: payload.email,
    department: payload.department,
    year: payload.year,
    password: payload.password,
  });
  return data.data;
};

type FormErrors = Partial<Record<keyof StudentRegisterForm, string>>;

/* ───────── Component ───────── */

export default function Register() {
  const [form, setForm] = useState<StudentRegisterForm>({
    name: "",
    email: "",
    department: "",
    year: 2026,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentRegisterForm, string>>
  >({});

  const mutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      setForm({
        name: "",
        email: "",
        department: "",
        year: 2026,
        password: "",
        confirmPassword: "",
      });
      toast.success("Signup successful. Await admin approval.");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Signup failed. Try again.",
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleYearChange = (value: number) => {
    setForm((prev) => ({
      ...prev,
      year: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    const result = studentRegisterSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof StudentRegisterForm;
        fieldErrors[fieldName] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(form);
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <NavLink to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MentorMeet
          </NavLink>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">
                    Signup for Student Account
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your details to fill the form
                  </p>
                </div>

                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </Field>

                <div className="flex items-center gap-4">
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                    />
                    {errors.department && (
                      <p className="text-sm text-red-500">
                        {errors.department}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Year</FieldLabel>
                    <YearSelect value={form.year} onChange={handleYearChange} />
                    {errors.year && (
                      <p className="text-sm text-red-500">{errors.year}</p>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </Field>

                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Sign Up"}
                  </Button>
                </Field>

                <Field>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <NavLink to="/signin" className="underline">
                      Sign in
                    </NavLink>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
