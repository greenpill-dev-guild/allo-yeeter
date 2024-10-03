"use client";
import { DiscoverRounds } from "@allo-team/kit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function AdminRounds() {
  const { address } = useAccount();
  if (!address) return <div>Connect your wallet</div>;
  return (
    <DiscoverRounds
      query={{
        where: {
          // Only rounds where we are admin or manager
          roles: {
            some: {
              address: { in: [address.toLowerCase() as `0x${string}`] },
            },
          },
        },
      }}
      renderItem={(round, Component) => (
        <Link
          href={`/admin/rounds/${round.chainId}/${round.id}`}
          key={round.id}
        >
          <Component {...round} />
        </Link>
      )}
      columns={[1, 2, 3]}
    />
  );
}
