"use client";

import {
  DiscoverApplications,
  DiscoverRounds,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  supportedChains,
} from "@allo-team/kit";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function Projects() {
  const router = useRouter();
  const params = useSearchParams();

  const network = params.get("network") ?? "10";
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Popular Projects</h1>
        <div className="flex gap-4 items-center">
          <h3 className="text-gray-muted text-sm tracking-wider">Network</h3>
          <Select
            value={network}
            onValueChange={(val) => router.push(`/?network=${val}`)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent>
              {supportedChains?.map((network) => (
                <SelectItem value={String(network.id)}>
                  {network.prettyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DiscoverApplications
        columns={[3]}
        query={{
          where: {
            chainId: { in: [Number(network)] },
            status: { equalTo: "APPROVED" },
          },
          orderBy: { total_amount_donated_in_usd: "desc" },
          first: 6,
        }}
        renderItem={(application, Card) => (
          <Link
            key={application.key}
            href={`/share/project/${application.projectId}`}
          >
            <Card {...application} components={["contributors"]} />
          </Link>
        )}
      />
      <h1 className="mt-16 mb-4 text-2xl font-semibold">Popular Rounds</h1>
      <DiscoverRounds
        columns={[2]}
        query={{
          where: {
            chainId: { in: [Number(network)] },
          },
          orderBy: { total_amount_donated_in_usd: "desc" },
          first: 6,
        }}
        renderItem={(round, Card) => (
          <Link
            key={round.key}
            href={`/share/round/${round.chainId}/${round.id}`}
          >
            <Card {...round} />
          </Link>
        )}
      />
    </div>
  );
}
