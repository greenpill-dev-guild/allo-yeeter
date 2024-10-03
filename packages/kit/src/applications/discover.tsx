"use client";

import type { ApplicationsQuery } from "../api/types";
import { useApplications } from "../hooks/useApplications";
import { Grid, type GridProps } from "../ui/grid";
import { ApplicationCard } from "./card";

export function DiscoverApplications({
  query,
  ...props
}: GridProps<ApplicationCard> & { query?: ApplicationsQuery }) {
  const applications = useApplications(query!);
  return (
    <Grid
      component={ApplicationCard}
      keys={["projectId"]}
      {...applications}
      {...props}
    />
  );
}
