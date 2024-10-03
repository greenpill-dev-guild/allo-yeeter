import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAPI } from "../api/provider";
import { Button } from "../ui/button";
import { useWalletClient } from "wagmi";
import { PropsWithChildren } from "react";

/*

This is temporary until Allo Protocol removes the requirement of a Profile to create a Round


*/

export function useProfile() {
  const api = useAPI();
  const { data: client } = useWalletClient();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => api.allo.getProfile(client!),
    enabled: Boolean(client),
  });
}
export function CreateProfileButton({ children }: PropsWithChildren) {
  const api = useAPI();
  const { data: client } = useWalletClient();
  const queryClient = useQueryClient();
  const profile = useProfile();

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
