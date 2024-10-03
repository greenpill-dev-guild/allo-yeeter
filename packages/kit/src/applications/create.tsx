"use client";

import { createElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useRoundById } from "../hooks/useRounds";
import type { ApplicationCreated, Round } from "../api/types";
import { useCreateApplication } from "../hooks/useApplications";
import { useRoundStrategyAddon } from "../strategies";
import { useAccount } from "wagmi";

const baseApplicationSchema = z.object({
  roundId: z.coerce.bigint(),
});

function ApplicationForm({
  defaultValues,
  round,
  onCreated,
}: {
  round: Round;
  defaultValues: z.infer<typeof baseApplicationSchema>;
  onCreated?: (application: ApplicationCreated) => void;
}) {
  const addon = useRoundStrategyAddon("registerRecipient", round);
  // Merge strategy schema into base round schema
  // TODO: Move this to a utility function or part of the useRoundStrategyAddon
  const schema = addon?.schema
    ? baseApplicationSchema.merge(z.object({ strategyData: addon.schema }))
    : baseApplicationSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { isValidating } = form.formState;
  const create = useCreateApplication();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log("create application", values);
          create.mutate(values, { onSuccess: onCreated });
        })}
        className="mx-auto max-w-screen-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            Create application for {round.name}
          </h3>
          <Button type="submit" isLoading={create.isPending || isValidating}>
            Create
          </Button>
        </div>
        {/* Render Strategy-specific form elements */}
        {addon?.component && createElement(addon.component, { round })}
      </form>
    </Form>
  );
}

export function CreateApplication({
  chainId,
  roundId,
  onCreated,
}: {
  chainId: string;
  roundId: string;
  onCreated?: (application: ApplicationCreated) => void;
}) {
  const { address } = useAccount();
  const { data: round, isPending } = useRoundById(roundId, { chainId });

  if (isPending) return <div>loading round...</div>;
  if (!round) return <div>Round not found</div>;

  return (
    <ApplicationForm
      round={round}
      onCreated={onCreated}
      defaultValues={{
        roundId: BigInt(roundId),
      }}
    />
  );
}
