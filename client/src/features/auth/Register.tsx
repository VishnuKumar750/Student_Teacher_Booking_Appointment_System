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

export default function Register() {
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
            <form className="flex flex-col gap-6">
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">
                    Signup for Student Account
                  </h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your details to fill the form
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" type="text" placeholder="rahul" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="rollno">Roll No.</FieldLabel>
                  <Input
                    id="rollno"
                    type="text"
                    placeholder="cse-26-88"
                    required
                  />
                </Field>
                <div className="flex  items-center gap-4">
                  <Field>
                    <FieldLabel htmlFor="course">Course</FieldLabel>
                    <Input
                      id="course"
                      type="text"
                      placeholder="b.tech / b.sc / bca"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="department">Department</FieldLabel>
                    <Input
                      id="department"
                      type="text"
                      placeholder="CSE / IT "
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="year">Year</FieldLabel>
                    <Input id="year" type="text" placeholder="2026" required />
                  </Field>
                </div>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input id="password" type="password" required />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="confirm-password">
                      confirm Password
                    </FieldLabel>
                  </div>
                  <Input id="confirm-password" type="password" required />
                </Field>
                <Field>
                  <Button type="submit">Sign Up</Button>
                </Field>
                <Field>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <NavLink
                      to="/signin"
                      className="underline underline-offset-4"
                    >
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
