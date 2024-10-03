"use client";
import { type PropsWithChildren, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { API } from "./types";

import { Toaster } from "../ui/toaster";
import type { StrategyExtensions } from "../strategies";
import { getQueryClient } from "./query-client";
import { mergeApi } from "./default-api";

type ProviderAPI = { api: API; strategies: StrategyExtensions };
const Context = createContext({} as ProviderAPI);

export function ApiProvider({
  children,
  api,
  queryClient = getQueryClient(),
  strategies,
  ...props
}: PropsWithChildren<{
  api?: Partial<API>;
  strategies?: StrategyExtensions;
  queryClient?: QueryClient;
}>) {
  const value = mergeApi({ api, strategies });
  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={value}>
        {children}
        <Toaster />
      </Context.Provider>
    </QueryClientProvider>
  );
}

export function useAPI() {
  return useContext(Context).api;
}

export function useStrategies() {
  return useContext(Context).strategies;
}
