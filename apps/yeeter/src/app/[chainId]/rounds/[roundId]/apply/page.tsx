"use client";

import { CreateApplication } from "@allo-team/kit";
import { useRouter } from "next/navigation";

export default function CreateApplicationPage({
  params: { roundId, chainId },
}: {
  params: { roundId: string; chainId: string };
}) {
  const router = useRouter();
  return (
    <section>
      <CreateApplication
        chainId={chainId}
        roundId={roundId}
        onCreated={({ id, chainId }) => {
          console.log("Application created", { id, chainId });
          router.push(`/${chainId}/applications/${id}`);
        }}
      />
    </section>
  );
}
