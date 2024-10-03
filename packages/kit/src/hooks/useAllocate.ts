import { useMutation } from "@tanstack/react-query";
import { Application, Round } from "../api/types";
import { useRoundStrategyAddon } from "../strategies";
import { useRef } from "react";

export function useAllocateState() {
  const state = useRef<Record<string, number>>({}).current;
  function set(id: string, amount: number) {
    state[id] = amount;
  }
  return { state, set };
}

export function useAllocate(round?: Round) {
  const strategyAddon = useRoundStrategyAddon("allocate", round);

  return useMutation({
    mutationFn: async ({
      applications,
      state,
    }: {
      applications?: Application[];
      state: Record<string, number>;
    }) => {
      return strategyAddon?.call.mutate([round, state, applications]);
    },
  });
}
