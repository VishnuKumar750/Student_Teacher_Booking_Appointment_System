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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/axios/axios-api";
import { YearSelect } from "@/components/year-select";
import {
  studentRegisterSchema,
  type StudentRegisterForm,
} from "./auth.validator";

const registerStudent = async (payload: StudentRegisterForm) => {
  console.log(payload);
  const { confirmPassword, ...body } = payload;
  const { data } = await api.post("/auth/signup", body);
  return data;
};

/* ───────────────── Component ───────────────── */

export default function Register() {
  /* ---- Mutation ---- */
  const mutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      reset();
      toast.success("Signup successful. Await admin approval.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Signup failed. Try again.",
      );
    },
  });

  /* ---- Form ---- */
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentRegisterForm>({
    resolver: zodResolver(studentRegisterSchema),
  });

  const onSubmit = (data: StudentRegisterForm) => {
    console.log("submit", data);
    mutation.mutate(data);
  };

  const isSubmitDisabled = mutation.isPending;

  /* ───────────────── JSX ───────────────── */

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
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                  <Input {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </Field>

                <div className="flex items-center gap-4">
                  <Field>
                    <FieldLabel>Department</FieldLabel>
                    <Input {...register("department")} />
                    {errors.department && (
                      <p className="text-sm text-red-500">
                        {errors.department.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Year</FieldLabel>
                    <Controller
                      name="year"
                      control={control}
                      render={({ field }) => (
                        <YearSelect
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.year && (
                      <p className="text-sm text-red-500">
                        {errors.year.message}
                      </p>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input type="password" {...register("password")} />
                </Field>

                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input type="password" {...register("confirmPassword")} />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Button type="submit" disabled={isSubmitDisabled}>
                    {mutation.isPending ? "Creating..." : "Sign Up"}
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
