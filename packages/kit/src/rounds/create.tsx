"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useCreateRound } from "../hooks/useRounds";
import { Address, getAddress, isAddress, zeroAddress } from "viem";
import { type RoundCreated } from "../api/types";

import { type PropsWithChildren, createElement, useState } from "react";
import { ImageUpload } from "../ui/image-upload";
import { useUpload } from "../hooks/useUpload";
import { EthAddressSchema } from "../schemas";
import {
  type StrategyExtensions,
  type StrategyType,
  useStrategyAddon,
} from "../strategies";
import { EnsureCorrectNetwork } from "../ui/correct-network";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CreateProfileButton,
  supportedChains,
  useProfile,
  useStrategies,
} from "..";
import { useNetwork } from "../hooks/useNetwork";
import { type TContracts } from "@gitcoin/gitcoin-chain-data";

const baseRoundSchema = z.object({
  name: z.string().min(2, {
    message: "Round name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  strategy: z.string(),
  token: EthAddressSchema.optional(),
  amount: z.coerce.bigint().optional(),
  chainId: z.coerce.number(),
  managers: z
    .string()
    .optional()
    .transform(
      (v) =>
        (v ?? "")
          .split(/[\s,]+/)
          .map((v) => v.trim())
          .map((addr) => (isAddress(addr) ? getAddress(addr) : false))
          .filter(Boolean) as Address[],
    ),
});

function CreateButton({
  isLoading,
  children,
}: PropsWithChildren<{ isLoading: boolean }>) {
  const chainId = Number(useFormContext().watch("chainId"));

  return (
    <EnsureCorrectNetwork chainId={chainId}>
      <CreateProfileButton>
        <Button type="submit" isLoading={isLoading}>
          {children}
        </Button>
      </CreateProfileButton>
    </EnsureCorrectNetwork>
  );
}

export function CreateRound({
  onCreated,
}: {
  onCreated?: (round: RoundCreated) => void;
}) {
  const strategies = useStrategies();
  const [strategy, setStrategy] = useState<StrategyType>(
    Object.values(strategies)[0]?.type!,
  );

  return (
    <CreateRoundForm
      selected={strategy}
      strategies={strategies}
      onChangeStrategy={setStrategy}
      onCreated={onCreated}
    />
  );
}
function CreateRoundForm({
  selected,
  strategies,
  onCreated,
  onChangeStrategy,
}: {
  strategies: StrategyExtensions;
  selected: StrategyType;
  onCreated?: (round: RoundCreated) => void;
  onChangeStrategy: (type: StrategyType) => void;
}) {
  const addon = useStrategyAddon("createRound", strategies[selected]);

  // Merge strategy schema into base round schema
  const schema = addon?.schema
    ? baseRoundSchema.merge(z.object({ initStrategyData: addon.schema }))
    : baseRoundSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: BigInt(0),
      name: "",
      description: "",
      chainId: 11155111,
      strategy: selected,
      token: zeroAddress,
      managers: undefined,
    },
  });

  const create = useCreateRound();
  const upload = useUpload();

  const network = useNetwork();

  const profile = useProfile();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async ({ name, description, ...values }) => {
            console.log("create round", values);

            // Get the strategy address based on selected network
            const strategy = getAddress(
              strategies[selected]?.contracts[values.chainId]!,
            );

            const pointer = await upload.mutateAsync({
              // TODO: This is GrantsStack-specific
              // Do we want to move this to the provider to build the metadata shape?
              // Could also use a transformer - api.transformers.roundMetadata({ name, description })
              round: {
                name,
                description,
                roundType: "public",
                quadraticFundingConfig: {
                  matchingFundsAvailable: 0,
                },
              },
            });
            const metadata = {
              protocol: BigInt(1),
              pointer: pointer as string,
            };

            create.mutate(
              { ...values, strategy, metadata, profileId: profile.data! },
              { onSuccess: onCreated },
            );
          },
        )}
        className="mx-auto max-w-screen-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Create round</h3>
          <CreateButton isLoading={upload.isPending || create.isPending}>
            {upload.isPending
              ? "Uploading metadata..."
              : create.isPending
                ? "Signing transaction..."
                : "Create"}
          </CreateButton>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Round name</FormLabel>
              <FormControl>
                <Input placeholder="Round name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Round description</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Round description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Markdown is supported</FormDescription>
            </FormItem>
          )}
        />
        <div className="gap-2 sm:flex">
          <FormField
            control={form.control}
            name="chainId"
            render={({ field }) => (
              <FormItem className="min-w-48">
                <FormLabel>Network</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select a network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {supportedChains?.map((network) => (
                      <SelectItem
                        key={network.id}
                        value={String(network.id)}
                        className="capitalize"
                      >
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Strategy</FormLabel>

                <Select
                  onValueChange={(value: keyof TContracts) => {
                    field.onChange(value);

                    onChangeStrategy(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(strategies)?.map((strategy) => (
                      <SelectItem key={strategy.type} value={strategy.type}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Render Strategy-specific form elements */}
        <div className="rounded border border-dashed p-4">
          {addon?.component && createElement(addon.component)}
        </div>

        <div className="gap-2 sm:flex">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="flex-1">
                {/* TODO: Dropdown with token names */}
                <FormLabel>Token</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(network?.tokens ?? []).map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Initial funding amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    type="number"
                    value={Number(field.value)}
                  />
                </FormControl>
                <FormDescription>
                  TODO: handle decimals from selected token
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="managers"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Round managers</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Enter your list of addresses here (comma or space separated)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                These will have access to make changes to the round.
              </FormDescription>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
