"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { PropsWithChildren } from "react";
import { Config, WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { Chain } from "viem/chains";
import * as wagmiChains from "viem/chains";

import { getChains } from "../utils/index";

export const supportedChains = getChains();

export const chains = Object.values(wagmiChains).filter((chain) =>
  supportedChains.map((c) => c.id).includes(chain.id),
) as unknown as [Chain, ...Chain[]];
const sepoliaIndex = chains.findIndex((c) => c.id === 11155111);
chains[sepoliaIndex].rpcUrls.default.http = [
  "https://ethereum-sepolia-rpc.publicnode.com/",
];
const arbitrumIndex = chains.findIndex((c) => c.id === 42161);
chains[arbitrumIndex].rpcUrls.default.http = ["https://arb1.arbitrum.io/rpc"];
supportedChains.filter((c) => [11155111, 42161].includes(c.id));

const defaultConfig = getDefaultConfig({
  appName: "Allo Kit",
  projectId: "ffa6468a2accec2f1e59502fae10c166",
  chains,
  ssr: true,
});

/*
Our default Web3Provider is RainbowKit + Wagmi + Gitcoin supported chains.

It is possible for apps to use their own implementation. 
However, Wagmi is currently a requirement because of hooks. 

*/
export function Web3Provider({
  children,
  config = defaultConfig,
}: PropsWithChildren<{ config?: Config }>) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
