"use client";

import { CreateRound, directGrants, quadraticFunding } from "@allo-team/kit";
import { useRouter } from "next/navigation";

export default function CreateRoundPage({}) {
  const router = useRouter();
  return (
    <section>
      <CreateRound
        onCreated={({ id, chainId }) => {
          console.log("Round created", { id, chainId });
          router.push(`/admin/rounds/${chainId}/${id}`);
        }}
      />
    </section>
  );
}
