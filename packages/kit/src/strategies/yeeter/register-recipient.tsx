"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import {
  Address,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from "viem";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { EthAddressSchema } from "../../schemas";
import { Input } from "../../ui/input";
import { StrategyCreateSchemaFn } from "..";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useProjects } from "../../hooks/useProjects";
import { Round } from "../../api/types";

export const createSchema: StrategyCreateSchemaFn = (api) =>
  z
    .object({
      __internal__: z.object({
        recipientAddress: EthAddressSchema,
        metadata: z.object({
          application: z.object({
            round: z.string(),
            recipient: z.string(),
          }),
        }),
      }),
    })
    .transform(async ({ __internal__: { recipientAddress, metadata } }) => {
      const pointer = await api.upload(metadata);

      return encodeAbiParameters(
        parseAbiParameters("address, address, (uint256, string)"),
        [zeroAddress, recipientAddress, [BigInt(1), pointer]],
      );
    });

export function RegisterRecipientForm({ round }: { round: Round }) {
  const { control, watch, setValue } = useFormContext();
  const { address, chainId } = useAccount();
  const lowercaseAddress = address?.toLocaleLowerCase() as Address;
  const { data: projects, error } = useProjects(
    {
      first: 10,
      where: {
        createdByAddress: { equalTo: lowercaseAddress },
        chainId: { equalTo: chainId },
      },
    },
    { enabled: Boolean(lowercaseAddress) },
  );

  useEffect(() => {
    // Initialize with connected wallet address
    setValue(
      "strategyData.__internal__.metadata.application.recipient",
      address,
    );
    setValue("strategyData.__internal__.metadata.application.round", round.id);
  }, [address]);
  return (
    <>
      <FormField
        control={control}
        name="strategyData.__internal__.recipientAddress"
        render={({ field }) => (
          <FormItem className="min-w-48">
            <FormLabel>Project</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.anchorAddress}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Payouts will be transferred to this project.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <pre>{watch("strategyData.__internal__.recipientAddress")}</pre>

      <FormField
        control={control}
        name="strategyData.__internal__.metadata.application.recipient"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
