"use client";

import { indexer } from "./providers/indexer";
import { allo } from "./providers/allo2";
import { directGrants } from "../strategies/direct-grants";
import { quadraticFunding } from "../strategies/quadratic-funding";

import type { API } from "./types";
import type { StrategyExtensions } from "../strategies";

/*
These are all the available methods in the API. Throws an error if not implemented.
*/
const emptyAPI: API = {
  indexer: {
    rounds: async () => Promise.reject(new Error("Not Implemented: rounds")),
    roundById: async () =>
      Promise.reject(new Error("Not Implemented: roundById")),
    projects: async () =>
      Promise.reject(new Error("Not Implemented: projects")),
    projectById: async () =>
      Promise.reject(new Error("Not Implemented: projectById")),
    applications: async () =>
      Promise.reject(new Error("Not Implemented: applications")),
    applicationById: async () =>
      Promise.reject(new Error("Not Implemented: applicationById")),
    donations: async () =>
      Promise.reject(new Error("Not Implemented: donations")),
  },
  allo: {
    createRound: async () =>
      Promise.reject(new Error("Not Implemented: createRound")),
    allocate: async () =>
      Promise.reject(new Error("Not Implemented: allocate")),
    createApplication: async () =>
      Promise.reject(new Error("Not Implemented: createApplication")),
    distribute: async () =>
      Promise.reject(new Error("Not Implemented: Distribute")),
    // Defines how the transaction data is sent. More details below.
    sendTransaction: async () =>
      Promise.reject(new Error("Not Implemented: sendTransaction")),

    getProfile: async () =>
      Promise.reject(new Error("Not Implemented: getProfile")),
    createProfile: async () =>
      Promise.reject(new Error("Not Implemented: createProfile")),
  },
  // AlloKit doesn't have a server so this needs to be implemented by the client.
  // Alternatively we can provide an endpoint (See apps/demo/src/app/api/ipfs/route.ts)
  upload: async () => Promise.reject(new Error("Not Implemented: upload")),

  // The Ballot API handles could start by implementing a localStorage API
  // Works for Checkout Cart also - can we find a better name than ballot?
  ballot: async () => Promise.reject(new Error("Not Implemented: Ballot")),
  saveBallot: async () =>
    Promise.reject(new Error("Not Implemented: saveBallot")),
  addToBallot: async () =>
    Promise.reject(new Error("Not Implemented: addToBallot")),
};

export const providers = {
  indexer,
  allo,
};

export const strategies = {
  directGrants,
  quadraticFunding,
};

export function mergeApi({
  api,
  strategies,
}: Partial<{ api: Partial<API>; strategies: StrategyExtensions }>): {
  api: API;
  strategies: StrategyExtensions;
} {
  return {
    api: {
      ...emptyAPI,
      indexer,
      allo,
      ...api,
    },
    strategies: {
      directGrants,
      quadraticFunding,
      ...strategies,
    },
  };
}
