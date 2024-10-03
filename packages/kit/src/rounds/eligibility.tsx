"use client";
import { QueryOpts, Round } from "../api/types";
import { useRoundById } from "../hooks/useRounds";
import { UseQueryResult } from "@tanstack/react-query";

export function RoundEligibilityWithHook({
  roundId,
  chainId,
  ...props
}: {
  roundId: string;
  chainId: number;
  opts?: QueryOpts;
}) {
  return (
    <RoundEligibility {...useRoundById(roundId, { chainId })} {...props} />
  );
}

export function RoundEligibility({
  data,
  isPending,
  error,
}: Partial<UseQueryResult<Round | undefined, unknown>>) {
  return (
    <div>
      <ul className="space-y-4">
        {data?.eligibility?.requirements?.map((req, i) => (
          <li key={i}>{req.requirement}</li>
        ))}
      </ul>
    </div>
  );
}
