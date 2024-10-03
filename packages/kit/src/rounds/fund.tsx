"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { type Address, formatUnits, parseUnits } from "viem";
import type { TToken } from "@gitcoin/gitcoin-chain-data";
import type { QueryOpts, Round } from "../api/types";
import { useRoundById } from "../hooks/useRounds";
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
import { supportedChains } from "../api/web3-provider";
import { useToken, useTokenBalance } from "../hooks/useToken";
import { useToast } from "../ui/use-toast";
import { Alert } from "../ui/alert";

type RoundFundProps = {
  id: string;
  chainId: number;
  autoFocus?: boolean;
  opts?: QueryOpts;
  onSuccess?: () => void;
};

export function useFundPool() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ amount }: { amount: number }) =>
      new Promise((r) => {
        setTimeout(() => r({ amount }), 1000);
      }),
    onSuccess: () => toast({ title: "Not implemented yet" }),
  });
}

export function getNetworkToken(round?: Round) {
  return supportedChains?.reduce<Partial<TToken>>(
    (match, chain) => {
      const token = (chain.tokens ?? {}).find((token) => {
        return (
          round?.chainId === chain.id &&
          token.address === round?.matching?.token
        );
      });

      return token || match;
    },
    { code: "", decimals: 0, icon: "" },
  );
}

export function FundRound({
  id,
  chainId,
  opts,
  autoFocus,
  onSuccess,
}: RoundFundProps) {
  const { data, isPending } = useRoundById(id, { chainId });
  const fund = useFundPool();
  if (isPending)
    return (
      <Alert className="flex h-[172px] items-center justify-center">
        Loading...
      </Alert>
    );
  if (!data) return <div>Round not found</div>;
  console.log(data);
  return (
    <section>
      {/* <div>
        Pool amount: <PoolAmount round={data} />
      </div> */}
      <FundForm
        funded={data?.matching.amount}
        token={data?.matching?.token!}
        isLoading={fund.isPending}
        autoFocus={autoFocus}
        onSubmit={(amount) => fund.mutate({ amount }, { onSuccess })}
      />
    </section>
  );
}

function TokenBalance({
  address,
  token,
}: {
  address?: Address;
  token?: Address;
}) {
  const { data: balance } = useTokenBalance({ address, token });
  return (
    <>
      {balance && formatUnits(balance?.value, balance?.decimals).slice(0, 6)}{" "}
      {balance?.symbol}
    </>
  );
}

function FundForm({
  funded,
  token,
  autoFocus,
  isLoading,
  onSubmit,
}: {
  funded?: bigint;
  token?: Address;
  isLoading: boolean;
  autoFocus?: boolean;
  onSubmit: (amount: number) => void;
}) {
  const { address } = useAccount();
  const form = useForm();

  const { data } = useToken(token);
  const { data: balance } = useTokenBalance({ address, token });
  console.log("data", data, balance);

  const amountInUints = balance
    ? parseUnits(form.watch("amount") ?? "0", balance?.decimals)
    : 0;
  const canSubmit = amountInUints > 0 && amountInUints <= (balance?.value ?? 0);

  console.log({ canSubmit }, amountInUints, balance?.value);
  return (
    <Form {...form}>
      <form
        className="space-y-2"
        onSubmit={form.handleSubmit((v) => onSubmit(v.amount))}
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    autoFocus={autoFocus}
                    placeholder="0"
                    step={0.0000000001}
                    type="number"
                    min={0}
                    {...field}
                  />
                  <div className="absolute right-2 p-2 text-muted-foreground"></div>
                </div>
              </FormControl>
              <FormDescription>
                Wallet balance: <TokenBalance address={address} token={token} />
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={isLoading}
          disabled={!canSubmit || isLoading}
          className="w-full"
          type="submit"
        >
          Fund
        </Button>
      </form>
    </Form>
  );
}
