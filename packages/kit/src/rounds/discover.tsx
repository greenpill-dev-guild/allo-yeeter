"use client";

import type { Round, RoundsQuery } from "../api/types";
import { useRounds } from "../hooks/useRounds";
import { Grid, type GridProps } from "../ui/grid";
import { RoundCard } from "./card";

export function DiscoverRounds({
  query,
  ...props
}: GridProps<Round> & { query?: RoundsQuery }) {
  const rounds = useRounds(query!);
  return <Grid component={RoundCard} {...rounds} {...props} />;
}
