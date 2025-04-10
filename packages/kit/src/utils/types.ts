import type { Address } from "viem";

type CoingeckoSupportedChainId =
  | 1
  | 10
  | 100
  | 1088
  | 250
  | 42161
  | 43114
  | 713715
  | 1329
  | 42
  | 42220
  | 295;

export type TToken = {
  code: string;
  icon?: string;
  address: Address;
  decimals: number;
  canVote: boolean;
  priceSource?: { chainId: CoingeckoSupportedChainId; address: Address };
  redstoneTokenId: string;
  voteAmountCap?: bigint;
  permitVersion?: string;
  default?: boolean;
};

export type TSubscription = {
  address: Address;
  contractName: string;
  fromBlock?: number;
  eventsRenames?: Record<string, string> | undefined;
};

export type TChain = {
  rpc: string;
  blockExplorer: string;
  name: string;
  prettyName: string;
  icon: string;
  type: TNetworkType;
  id: number;
  coingeckoId: string;
  contracts: TContracts;
  pricesFromTimestamp?: number;
  maxGetLogsRange?: number;
  tokens: TToken[];
  subscriptions: TSubscription[];
};

export type TContracts = {
  multiRoundCheckout: Address;
  quadraticFunding: Address;
  directGrants: Address;
  directAllocationPoolId?: number;
  directAllocationStrategyAddress?: Address;
  ensUniversalResolver?: Address;
  retroFunding?: Address;
};

export type TNetworkType = "mainnet" | "testnet";
