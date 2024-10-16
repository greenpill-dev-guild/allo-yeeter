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

import { StrategyCreateSchemaFn } from "..";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  encodeAbiParameters,
  parseAbiParameter,
  parseAbiParameters,
} from "viem";
import { EthAddressSchema } from "../../schemas";

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
      recipientIds: z.array(EthAddressSchema),
      amounts: z.array(z.bigint()),
      token: EthAddressSchema,
    })
    // Transform the dates into initStrategyData
    .transform((val) => {
      // convert recipientIds and amounts into data bytes
      const data = encodeAbiParameters(
        parseAbiParameters("address[], uint256[], address"),
        [val.recipientIds, val.amounts, val.token],
      );
      return YeeterStrategy.prototype.getInitializeData({ data });
    });

export function CreateAllocationForm() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
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
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="destructive"
            size="icon"
          >
            X
          </Button>
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
