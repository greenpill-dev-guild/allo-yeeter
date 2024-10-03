import { type FunctionComponent, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import type { Address } from "viem";
import type { TContracts } from "@gitcoin/gitcoin-chain-data";
import { supportedChains } from "../api/web3-provider";
import type { API, Round } from "../api/types";
import { useAPI, useStrategies } from "..";
import z from "zod";

// These represent the different function calls in Allo Protocol
export type StrategyComponentType =
  | "createRound"
  | "roundDetails"
  | "registerRecipient"
  | "reviewRecipients"
  | "allocate";

export type StrategyType = keyof TContracts | string;
export type StrategyExtension = {
  name: string;
  type: StrategyType;
  contracts: Record<number, Address>;
  components: Partial<
    Record<
      StrategyComponentType,
      Partial<{
        createSchema: StrategyCreateSchemaFn;
        defaultValues: unknown;
        component: FunctionComponent<any> | null;
        call?: Function;
      }>
    >
  >;
};

export type StrategyCreateSchemaFn = (api: API) => z.ZodTypeAny;
export type StrategyExtensions = Record<StrategyType, StrategyExtension>;

const strategyMap = {
  "allov2.DirectGrantsLiteStrategy": "directGrants",
} as const;

function getStrategyTypeFromName(strategyName: string, chainId: number) {
  return reduceSupportedChains(chainId, ([name]) => {
    console.log(name, strategyName);
    return name === strategyMap[strategyName as keyof typeof strategyMap];
  });
}

// Helper function to find matching contract from name or address
function reduceSupportedChains(
  chainId: number,
  compare: (args: [key: string, address: Address | number]) => boolean,
) {
  return supportedChains?.reduce((match, chain) => {
    const type = Object.entries(chain.contracts ?? {}).find(
      ([key, address]) => chain.id === chainId && compare([key, address]),
    );

    return type?.[0] || match;
  }, "");
}

export function useStrategyType(round?: Round) {
  return useMemo(
    () =>
      round && getStrategyTypeFromName(round?.strategyName!, round?.chainId),
    [round],
  );
}

export function useStrategyAddon(
  component: StrategyComponentType,
  strategy?: StrategyExtension,
) {
  const api = useAPI();
  const { data: signer } = useWalletClient();
  const addon = strategy?.components?.[component];
  if (!addon) return null;
  return {
    ...addon,
    // Create the schema and pass the api so we can use it in the schema transform function
    schema: addon?.createSchema?.(api),
    // Wrap the strategy call function in useMutation (for loading + error states)
    // Include api + signer
    call: useMutation({
      mutationFn: (args: unknown[]) => addon?.call?.(...args, api, signer),
    }),
  };
}

export function useRoundStrategyAddon(
  component: StrategyComponentType,
  round?: Round,
) {
  const strategies = useStrategies();
  const type = useStrategyType(round);
  const strategy = type ? strategies[type] : undefined;

  return useStrategyAddon(component, strategy);
}

export function useRoundStrategyAddonCall(
  component: StrategyComponentType,
  round?: Round,
) {
  return useRoundStrategyAddon(component, round)?.call;
}
