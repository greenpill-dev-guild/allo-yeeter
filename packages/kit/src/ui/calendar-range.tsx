import { CalendarIcon } from "lucide-react";
import { Button, FormControl } from "..";
import { cn } from "../lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { PropsWithChildren } from "react";

export function RangeCalendar<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  field,
}: PropsWithChildren<{ field: ControllerRenderProps<TFieldValues, TName> }>) {
  const { value, onChange } = field;
  const { from, to } = value ?? { from: null, to: null };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "pl-3 text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            {value ? formatDateRange({ from, to }) : children}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
function formatDateRange({ from, to }: { from: Date | null; to: Date | null }) {
  return from && `${format(from, "PPP")}${to ? ` - ${format(to, "PPP")}` : ""}`;
}
