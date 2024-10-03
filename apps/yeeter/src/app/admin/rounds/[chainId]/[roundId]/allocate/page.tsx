"use client";
import { Allocate } from "@allo-team/kit";

export default function AllocatePage({
  params: { chainId = 0, roundId = "" },
}) {
  return (
    <section className="space-y-8">
      <Allocate roundId={roundId} chainId={Number(chainId)} />
    </section>
  );
}
