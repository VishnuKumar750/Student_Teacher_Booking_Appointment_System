import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, X } from "lucide-react";

type Item = {
  label: string;
  value: string;
};

type ComboSelectProps = {
  items: Item[];
  value: string | string[] | undefined;
  onChange: (value: string | string[] | undefined) => void;
  multiple?: boolean;
  placeholder?: string;
};

export function ComboSelect({
  items,
  value,
  onChange,
  multiple = false,
  placeholder = "Select option",
}: ComboSelectProps) {
  const [open, setOpen] = React.useState(false);

  const values = multiple
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];

  const toggleValue = (val: string) => {
    if (multiple) {
      if (values.includes(val)) {
        onChange(values.filter((v) => v !== val));
      } else {
        onChange([...values, val]);
      }
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const removeValue = (val: string) => {
    if (multiple) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange(undefined);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-start min-h-[40px] flex-wrap gap-1"
        >
          {values.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {values.map((val) => {
            const item = items.find((i) => i.value === val);
            if (!item) return null;

            return (
              <Badge key={val} variant="secondary" className="gap-1">
                {item.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(val);
                  }}
                />
              </Badge>
            );
          })}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => {
              const selected = values.includes(item.value);

              return (
                <CommandItem
                  key={item.value}
                  onSelect={() => toggleValue(item.value)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
