"use client";
import {
  Button,
  BackButton,
  DiscoverApplications,
  RoundDetailsWithHook as RoundDetails,
} from "@allo-team/kit";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails
        roundId={roundId}
        chainId={chainId}
        backAction={
          <Link href={`/${chainId}`}>
            <BackButton />
          </Link>
        }
        primaryAction={
          <div className="flex gap-2">
            <Link href={`/${chainId}/rounds/${roundId}/fund`}>
              <Button variant={"outline"}>Fund Round</Button>
            </Link>
            <Link href={`/${chainId}/rounds/${roundId}/apply`}>
              <Button>Apply to Round</Button>
            </Link>
          </div>
        }
      />

      <h3 className="text-lg font-semibold">Approved Projects</h3>
      <DiscoverApplications
        columns={[1, 3]}
        query={{
          first: 12,
          where: {
            roundId: { equalTo: roundId },
            status: { equalTo: "APPROVED" },
          },
        }}
        renderItem={(application, Component) => (
          <Link
            href={`/${chainId}/projects/${application.projectId}`}
            key={application.id}
          >
            <Component {...application} />
          </Link>
        )}
      />
    </section>
  );
}
