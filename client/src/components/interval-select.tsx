import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Clock } from "lucide-react";

type TimeInterval = {
  start: string;
  end: string;
};

type IntervalSelectProps = {
  value?: TimeInterval;
  onChange: (interval: TimeInterval) => void;
  intervals: TimeInterval[];
};

export function IntervalSelect({
  value,
  onChange,
  intervals,
}: IntervalSelectProps) {
  return (
    <Field>
      <Select
        value={value ? `${value.start}-${value.end}` : undefined}
        onValueChange={(val) => {
          const [start, end] = val.split("-");
          onChange({ start, end });
        }}
      >
        <SelectTrigger className="w-full">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Select time slot" />
        </SelectTrigger>

        <SelectContent>
          {intervals.map((slot) => (
            <SelectItem
              key={`${slot.start}-${slot.end}`}
              value={`${slot.start}-${slot.end}`}
            >
              {slot.start} – {slot.end}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
