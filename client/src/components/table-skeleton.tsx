import { Skeleton } from "./ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Skeleton className="w-sm h-6" />
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
