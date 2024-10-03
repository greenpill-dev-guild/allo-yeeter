"use client";

import { type PropsWithChildren } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Button } from "../ui/button";
import { ConnectButton } from "../connect-button";

export function EnsureCorrectNetwork({
  children,
  chainId,
}: PropsWithChildren<{ chainId: number }>) {
  const connectedNetwork = useChainId();
  const { isConnecting, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  if (!isConnecting && !isConnected) return <ConnectButton />;
  if (connectedNetwork !== chainId)
    return (
      <Button isLoading={isConnecting} onClick={() => switchChain({ chainId })}>
        Change network
      </Button>
    );
  return <>{children}</>;
}
