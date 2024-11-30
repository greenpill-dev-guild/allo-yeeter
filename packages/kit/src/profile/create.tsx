"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "../api/provider";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { WalletIcon } from "lucide-react";
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

  if (!client) {
    return (
      <Alert
        variant="default"
        className="flex max-w-md items-center justify-center gap-2"
      >
        <WalletIcon className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to continue
        </AlertDescription>
      </Alert>
    );
  }
  if (profile.data) {
    return <>{children}</>;
  }
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
