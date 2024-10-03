import {
  DiscoverApplications,
  DiscoverRounds,
  ProjectDetailsWithHook,
} from "@allo-team/kit";
import { indexer } from "@allo-team/kit";
import { Metadata } from "next";

export async function generateMetadata({
  params: { projectId },
}: {
  params: { projectId: string };
}): Promise<Metadata> {
  const project = await indexer.projectById(projectId);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
  };
}
export default async function ShareProjectPage({ params: { projectId = "" } }) {
  return (
    <div>
      <ProjectDetailsWithHook id={projectId} />
    </div>
  );
}
