import AddTeacher from "@/components/add-teacher-form";

interface Props {
  refresh: () => void;
}

export default function TeachersHeader({ refresh }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Teachers</h1>
        <p className="text-sm text-muted-foreground">
          Manage teachers, subjects, and availability
        </p>
      </div>

      <AddTeacher refresh={refresh} />
    </div>
  );
}
