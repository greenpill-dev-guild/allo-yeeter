"use client";
import { useMemo } from "react";
import { cn } from "../lib/utils";
import { Badge } from "../ui/badge";
import { supportedChains } from "..";

export function RoundNetworkBadge({ chainId }: { chainId?: number }) {
  const network = useMemo(
    () => supportedChains?.find((chain) => chain.id === chainId),
    [chainId],
  );
  if (!network) return null;

  return (
    <Badge variant="secondary" className={cn("capitalize")}>
      {network.name}
    </Badge>
  );
}
