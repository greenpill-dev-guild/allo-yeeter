"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { YeeterStrategy } from "@allo-team/allo-v2-sdk/";
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
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

/*
When creating a Round we pass a byte string called initStrategyData.
This contains strategy-specific data and for YeeterStrategy it's registration start and end dates.
*/
export const createSchema: StrategyCreateSchemaFn = () =>
  z
    .object({
      /*
    initStrategyData expects to be a bytes string starting with 0x.
    Temporarily store from and to in an internal state. This will be encoded into the bytes string.
    */
      __internal__: z.object({ from: z.date(), to: z.date() }),
      recipientIds: z.array(z.string()),
      amounts: z.array(z.number()),
    })
    // Transform the dates into initStrategyData
    .transform((val) => {
      // convert recipientIds and amounts into data bytes
      const data = 
      return YeeterStrategy.prototype.getInitializeData({
        poolId: BigInt(0),
        data: "0x0",
        // registrationStartTime: dateToUint64(from),
        // registrationEndTime: dateToUint64(to),
      });
    });

export function CreateRoundForm() {
  const { control } = useFormContext();
  return (
    <>
      <RecipientAndAmountField />
    </>
  );
}

function RecipientAndAmountField() {
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "recipientIdsAndAmounts",
  });

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Recipients and Amounts</FormLabel>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 flex space-x-2">
          <FormField
            control={control}
            name={`recipientIds.${index}`}
            render={({ field }) => (
              <Input {...field} placeholder="Recipient Address" />
            )}
          />
          <FormField
            control={control}
            name={`amounts.${index}`}
            render={({ field }) => (
              <Input {...field} placeholder="Amount" type="number" />
            )}
          />
        </div>
      ))}
      <div className="mt-2 flex justify-end">
        <Button
          type="button"
          onClick={() => append({ recipientId: "", amount: "" })}
          className="inline-flex"
        >
          Add Recipient
        </Button>
      </div>
      <FormDescription>
        Add recipient IDs and their corresponding amounts.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
