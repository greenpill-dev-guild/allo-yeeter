"use client";

import type { Project, RoundsQuery } from "../api/types";
import { useProjects } from "../hooks/useProjects";
import { Grid, type GridProps } from "../ui/grid";
import { ProjectCard } from "./card";

export function DiscoverProjects({
  query,
  ...props
}: GridProps<Project> & { query?: RoundsQuery }) {
  const projects = useProjects(query!);
  return <Grid component={ProjectCard} {...projects} {...props} />;
}
