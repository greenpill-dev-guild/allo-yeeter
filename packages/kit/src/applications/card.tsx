import { Button } from "..";
import type { Application } from "../api/types";
import { cn, formatMoney, formatNumber } from "../lib/utils";
import { BackgroundImage } from "../ui/background-image";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export type ApplicationCard = Application & {
  components?: ApplicationComponent[];
  isLoading?: boolean;
};
type ApplicationComponent = "contributors" | "add_button";
export function ApplicationCard({
  name,
  description,
  bannerUrl,
  contributors,
  components = [],
  isLoading,
}: ApplicationCard) {
  return (
    <Card
      className={cn("relative overflow-hidden rounded-3xl shadow-xl", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <BackgroundImage className="h-32 bg-gray-100" src={bannerUrl} />

      <CardContent className="space-y-2 p-4">
        <h3 className="truncate text-xl font-semibold text-gray-800">{name}</h3>
        <p className="line-clamp-3 h-[70px] text-xs leading-6">{description}</p>
        {contributors && components.length ? (
          <div className="py-2">
            <Separator />
          </div>
        ) : null}
        <div className="flex justify-between">
          {contributors && components.includes("contributors") && (
            <div>
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                <ContributionIcon />
                {formatMoney(contributors?.amount, "usd", 0)}
              </div>
              <div className="text-xs">
                {formatNumber(contributors?.count)} contributors
              </div>
            </div>
          )}
          {components.includes("add_button") && <Button size="sm">Add</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

function ContributionIcon() {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="4.00969"
        cy="4.75145"
        rx="4.00969"
        ry="4.75145"
        transform="matrix(0.875882 0.482526 -0.51768 0.855574 6.97559 -6.10352e-05)"
        fill="#D3F0ED"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.56719 5.10026L5.54038 3.1663C4.93332 2.58674 3.89573 2.99724 3.89573 3.81636V4.26554C3.89573 4.58714 3.62244 4.84791 3.28475 4.84791H0.998707C0.487102 4.84791 0.0281291 5.21381 0.00132301 5.70166C-0.0271176 6.22196 0.406684 6.65242 0.945422 6.65242H3.28475C3.62244 6.65242 3.89573 6.91319 3.89573 7.23511V7.68397C3.89573 8.5031 4.93332 8.9136 5.54038 8.33403L7.56719 6.40038C7.94345 6.04135 7.94345 5.45898 7.56719 5.10026Z"
        fill="#00433B"
      />
    </svg>
  );
}

/*
TODO: Export ApplicationTitle and ApplicationDescription components

See: rounds/card.tsx

Also figure out a good way to handle different slots in the card footer
(add_button, contributors)
*/
