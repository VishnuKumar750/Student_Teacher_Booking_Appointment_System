import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";


// ------------------ ZOD SCHEMA ------------------
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Minimum 4 characters"),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
});

// ------------------ FAKE API CALL ------------------
const fakeLoginApi = (data: any): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    console.log("Simulated login API:", data);
    setTimeout(() => resolve({ success: true }), 1200);
  });
};


const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const res = await fakeLoginApi(data);
    setLoading(false);

    if (res.success) alert("Logged in successfully!");
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <Label>Email</Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <Label>Password</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    {...field}
                    autoComplete="new-password"
                    spellCheck={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ROLE */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <Label>Select Role</Label>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
