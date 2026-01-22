"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // ← use shadcn version
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface Item {
  _id: string;
  name: string;
  // add other fields you need
}

interface AutoCompleteProps {
  placeholder: string;
  value: string | null; // ← selected _id
  onValueChange: (value: string | null) => void; // ← renamed + proper type
  searchQueryKey: string; // base key for query
  searchFunction: (search: string) => Promise<Item[]>; // ← must accept search term
  className?: string;
}

export function AutoCompleteSearch({
  placeholder,
  value,
  onValueChange,
  searchQueryKey,
  searchFunction,
  className,
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);

  // Reset search when closing popover
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [searchQueryKey, debouncedSearch],
    queryFn: () => searchFunction(debouncedSearch),
    enabled: debouncedSearch.trim().length >= 3,
    staleTime: 60 * 1000, // 1 minute
  });

  const results = data ?? [];
  const selectedItem = results.find((item) => item._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-sm text-muted-foreground tracking-tight",
            className,
          )}
        >
          {selectedItem ? selectedItem.name : placeholder}
          {open ? (
            <X className="ml-2 w-4 h-4 shrink-0 opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "min-w-[var(--radiz-popover-trigger-width)] p-0",
          className,
        )}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            autoFocus
          />

          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Searching...
              </div>
            )}

            {isError && (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load results
              </div>
            )}

            {!isLoading && !isError && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup>
                  {results.map((item) => (
                    <CommandItem
                      key={item._id}
                      value={item._id}
                      onSelect={() => {
                        onValueChange(item._id === value ? null : item._id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item._id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
