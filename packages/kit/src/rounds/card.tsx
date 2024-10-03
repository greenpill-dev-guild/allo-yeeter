import { useMemo } from "react";
import type { Round } from "../api/types";
import { TokenAmount } from "../ui/token-amount";
import { BackgroundImage } from "../ui/background-image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { cn, supportedChains } from "..";
import { RoundStrategyBadge } from "./strategy-badge";
import { getRoundTime } from "./utils";
import { createComponent } from "../ui";

const getNetwork = (chainId: number) =>
  supportedChains?.find((chain) => chain.id === chainId);

export type RoundCard = Round & {
  // components?: RoundComponent[];
  isLoading?: boolean;
};

export function RoundCard({
  name,
  description,
  chainId,
  applications,
  matching,
  bannerUrl,
  phases,
  strategyName,
  isLoading,
}: RoundCard) {
  const network = useMemo(() => getNetwork(chainId), [chainId]);

  return (
    <Card
      className={cn("relative overflow-hidden rounded-3xl shadow-xl", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <div className="">
        <RoundBanner src={bannerUrl} />
        <RoundHeader>{name}</RoundHeader>
      </div>
      <CardContent className="space-y-2 p-4">
        <RoundDescription>{description}</RoundDescription>

        <div className="flex flex-1 items-center justify-between text-xs">
          <div className="w-1/2 truncate font-mono">{getRoundTime(phases)}</div>
          <div className="flex w-1/2 justify-end">
            <RoundStrategyBadge strategyName={strategyName} />
          </div>
        </div>
        <Separator className="my-2" />
        <div className="">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex gap-2">
                {applications && (
                  <Badge variant={"secondary"}>
                    {applications?.length} projects
                  </Badge>
                )}
                {matching && (
                  <Badge variant={"secondary"}>
                    <TokenAmount {...matching} />
                  </Badge>
                )}
              </div>
            </div>
            <Avatar className="size-8">
              <div
                className="size-8"
                dangerouslySetInnerHTML={{ __html: network?.icon! }}
              />
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoundBanner({ src = "" }) {
  return <BackgroundImage className="h-32 bg-gray-800" src={src} />;
}

export const RoundHeader = createComponent(
  "h3",
  "-mt-8 truncate pl-1 text-2xl font-medium text-gray-100",
);

export const RoundDescription = createComponent(
  "p",
  "line-clamp-4 h-24 text-base leading-6",
  {
    variants: { variant: { red: "text-red-600" } },
  },
);
