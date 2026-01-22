import { AutoCompleteSelect } from "@/components/AutoCompleteSelect";
import { AutoCompleteSearch } from "@/components/typeahead-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle } from "lucide-react";
import type { ReactNode } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
}

export default function Teachers() {
  return (
    <div>
      <div>
        {/* search, select - department, subject*/}

        {/* add button - create teacher*/}
        <TeacherDialog />
      </div>
    </div>
  );
}

const teacherSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  department: z.string().min(2, "Department is required"),
  subject: z.string().min(2, "subject is required"),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

// api
const createTeacher = async (data: TeacherFormValues) => {
  // api routes
};
const updateTeacher = async ({
  _id,
  ...data
}: { _id: string } & TeacherFormValues) => {};

interface TeacherDialogProps {
  data?: Teacher;
  trigger?: ReactNode;
  children?: ReactNode;
}

function TeacherDialog({ data, trigger, children }: TeacherDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!data;

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      department: data?.department || "",
      subject: data?.subject || "",
    },
  });

  const mutation = useMutation({
    mutationFn: isEdit
      ? (values: TeacherFormValues) =>
          updateTeacher({ _id: data!._id, ...values })
      : (values: TeacherFormValues) => createTeacher(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(isEdit ? "Teacher updated" : "Teacher created");
      form.reset();
    },
    onError: (error) => {
      toast.error(`something went wrong. ${error.message}`);
    },
  });

  const onSubmit = (values: TeacherFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-foreground text-sm font-bold tracking-tight">
            <PlusCircle className="mr-2 h-5 w-5" />
            {isEdit ? "Edit Teacher" : "Add Teacher"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update Teacher" : "Add New Teacher"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to teacher information."
              : "Enter details for the new teacher."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...form.register("department")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...form.register("subject")} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
