"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "../api/provider";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useWalletClient } from "wagmi";
import { PropsWithChildren } from "react";

/*

This is temporary until Allo Protocol removes the requirement of a Profile to create a Round


*/

export function useProfile() {
  const api = useAPI();
  const { data: client } = useWalletClient();
  console.log("client", client);
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => api.allo.getProfile(client!),
    enabled: Boolean(client),
  });
}

export function CreateProfileButton({ children }: PropsWithChildren) {
  console.log("CreateProfileButton");
  const api = useAPI();
  const { data: client } = useWalletClient();
  const queryClient = useQueryClient();
  const profile = useProfile();
  console.log("profile", profile, client);

  if (!client)
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-[200px]" />
      </div>
    );

  api.allo
    .getProfile(client)
    .then((data) => console.log("profile data", data))
    .catch((error) => console.error("profile error", error));

  const create = useMutation({
    mutationFn: async () => {
      const name = "allo-kit-profile";
      const pointer = await api.upload({ name, type: "program" });
      return api.allo.createProfile(
        { metadata: { pointer, protocol: BigInt(1) }, name },
        client!,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
    onError: (error) => {
      console.error("Error creating profile", error);
    },
  });

  if (profile.data) return <>{children}</>;
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm">You need to create a profile first</div>
      <Button
        type="button"
        isLoading={create.isPending}
        onClick={() => create.mutate()}
      >
        Create Profile
      </Button>
    </div>
  );
}
