"use client";
import { useWalletClient } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { API, ApplicationInput, ApplicationsQuery } from "../api/types";
import { useAPI } from "..";

const defaultQuery: ApplicationsQuery = {
  where: {},
  offset: 0,
  first: 12,
  orderBy: { created_at_block: "asc" } as const,
};
export function useApplications(query: ApplicationsQuery = defaultQuery) {
  const api = useAPI();
  return useQuery({
    queryKey: ["applications", query],
    queryFn: async () => api.indexer.applications(query),
  });
}

type ApplicationByID = Parameters<API["indexer"]["applicationById"]>;
export function useApplicationById(
  id: ApplicationByID[0],
  opts?: ApplicationByID[1],
) {
  const api = useAPI();
  return useQuery({
    queryKey: ["application", { id, opts }],
    queryFn: async () => api.indexer.applicationById(id, opts),
    enabled: Boolean(id),
  });
}
export function useCreateApplication() {
  const api = useAPI();
  const { data: client } = useWalletClient();
  return useMutation({
    mutationFn: (data: ApplicationInput) =>
      api.allo.createApplication(data, client!),
    onSuccess: () => {}, // TODO: add toast
    onError: () => {},
  });
}
