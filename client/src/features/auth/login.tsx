import { GalleryVerticalEnd } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/axios/axios-api";
import { useAuth } from "@/hooks/use-auth";

/* ───────────────── Schema ───────────────── */

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

/* ───────────────── API ───────────────── */

const loginUser = async (payload: LoginForm) => {
  const { data } = await api.post("/auth/signin", payload);
  return data.data; // expected: { user: {...} }
};

/* ───────────────── Component ───────────────── */

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const user = data;
      login(user); // store user in auth context + localStorage
      toast.success("Logged in successfully");
      navigate(`/${user.role}`);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message || "Invalid email or password",
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

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
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your email and password to continue
                  </p>
                </div>

                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input type="password" {...register("password")} />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </Field>

                <Field>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <NavLink
                      to="/signup"
                      className="underline underline-offset-4"
                    >
                      Sign up
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
