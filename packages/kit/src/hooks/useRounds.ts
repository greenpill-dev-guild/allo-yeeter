"use client";
import { useWalletClient } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { API, RoundInput, RoundsQuery } from "../api/types";
import { useAPI } from "..";
import { useToast } from "../ui/use-toast";

const defaultQuery: RoundsQuery = {
  where: {},
  offset: 0,
  first: 12,
};

export function useRounds(query: RoundsQuery = defaultQuery) {
  const api = useAPI();
  return useQuery({
    queryKey: ["rounds", query],
    queryFn: async () => api.indexer.rounds(query),
  });
}

type RoundParams = Parameters<API["indexer"]["roundById"]>;
export function useRoundById(id: RoundParams[0], opts?: RoundParams[1]) {
  const api = useAPI();
  return useQuery({
    queryKey: ["round", { id, opts }],
    queryFn: async () => api.indexer.roundById(id, opts),
    enabled: Boolean(id),
  });
}

export function useCreateRound() {
  const api = useAPI();
  const { toast } = useToast();
  const { data: client } = useWalletClient();
  return useMutation({
    mutationFn: (data: RoundInput) => api.allo.createRound(data, client!),
    onSuccess: () => toast({ title: "Round created!" }),
    onError: (err) => toast({ variant: "destructive", title: err.toString() }),
  });
}
