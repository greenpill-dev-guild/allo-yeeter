import { DonationsTableWithHook, ProjectDetailsWithHook } from "@allo-team/kit";

export default function ProjectPage({
  params: { chainId = 0, projectId = "" },
}) {
  return (
    <section className="space-y-8">
      <ProjectDetailsWithHook id={projectId} chainId={chainId} />
      <div>
        <h3 className="text-xl font-semibold">Donations</h3>
        <DonationsTableWithHook
          query={{
            first: 300,
            where: {
              projectId: { equalTo: projectId },
            },
            orderBy: {
              amount_in_usd: "desc",
            },
          }}
        />
      </div>
    </section>
  );
}
