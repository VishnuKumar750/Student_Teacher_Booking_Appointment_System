import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeRange {
  startTime: string;
  endTime: string;
}

interface TimeRangePickerProps {
  value?: TimeRange;
  onChange: (value: TimeRange) => void;
}

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const startTime = value?.startTime || "";
  const endTime = value?.endTime || "";

  const handleStartChange = (start: string) => {
    onChange({
      startTime: start,
      endTime,
    });
  };

  const handleEndChange = (end: string) => {
    onChange({
      startTime,
      endTime: end,
    });
  };

  const isInvalid = startTime && endTime && startTime >= endTime;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label>Start Time</Label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => handleStartChange(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>End Time</Label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => handleEndChange(e.target.value)}
        />
      </div>

      {isInvalid && (
        <p className="col-span-2 text-xs text-red-500">
          End time must be after start time
        </p>
      )}
    </div>
  );
}
