"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { DirectGrantsLiteStrategy } from "@allo-team/allo-v2-sdk/";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { dateToUint64 } from "../../api/providers/allo2";
import { RangeCalendar } from "../../ui/calendar-range";
import { StrategyCreateSchemaFn } from "..";

/*
When creating a Round we pass a byte string called initStrategyData.
This contains strategy-specific data and for DirectGrantsLite it's registration start and end dates.
*/
export const createSchema: StrategyCreateSchemaFn = () =>
  z
    .object({
      /*
    initStrategyData expects to be a bytes string starting with 0x.
    Temporarily store from and to in an internal state. This will be encoded into the bytes string.
    */
      __internal__: z.object({ from: z.date(), to: z.date() }),
    })
    // Transform the dates into initStrategyData
    .transform((val) => {
      const { from, to } = val.__internal__;
      return DirectGrantsLiteStrategy.prototype.getInitializeData({
        useRegistryAnchor: false,
        metadataRequired: false,
        registrationStartTime: dateToUint64(from),
        registrationEndTime: dateToUint64(to),
      });
    });

export function CreateRoundForm() {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="initStrategyData.__internal__"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Project Registration</FormLabel>
              <RangeCalendar field={field}>
                Pick start and end dates
              </RangeCalendar>
              <FormDescription>
                When can projects submit their application?
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
