"use client";
import { NumericFormat } from "react-number-format";
import { useApplications } from "../hooks/useApplications";
import { useRoundById } from "../hooks/useRounds";
import { useRoundStrategyAddon } from "../strategies";
import { BackgroundImage } from "../ui/background-image";
import { Input } from "../ui/input";
import { Button } from "..";
import { useRef } from "react";
import { useAllocate, useAllocateState } from "../hooks/useAllocate";

type AllocateProps = {
  roundId: string;
  chainId: number;
};

export function Allocate({ roundId, chainId }: AllocateProps) {
  const { data: round } = useRoundById(roundId, { chainId });
  const { data: applications, isPending } = useApplications({
    where: {
      roundId: { equalTo: roundId },
      status: { equalTo: "APPROVED" },
      chainId: { equalTo: chainId },
    },
  });

  const allocate = useAllocate(round);
  const { state, set } = useAllocateState();

  return (
    <section>
      <div className="mb-2 flex justify-between">
        <div />
        <Button
          isLoading={allocate.isPending}
          onClick={() => {
            console.log("call", round, state, applications);
            /* 
            TODO: What data do we need to send to the allocate function?
            
            Different strategies expect different data structure. For example:
            - DirectGrants - Array of allocations
            _allocate([{ amount, token, recipientId }])
            
            - QF (DonationVotingMerkleDistribution) - single recipientId + permit2 
            _allocation({ recipientId, permit })
            
            Perhaps best option is to send all the approved applications + state of recipientId and amount
            Each Strategy Allocate function can then create the data the contract needs.
            */
            allocate.mutate({ state, applications });
          }}
        >
          Allocate
        </Button>
      </div>
      <div className="divide-y">
        {applications?.map((application) => (
          <div key={application.id} className="flex items-center gap-2 py-2">
            <BackgroundImage
              className="size-12 rounded bg-gray-100"
              src={application.avatarUrl}
            />
            <h3 className="flex-1 text-lg">{application.name}</h3>

            <div>
              <NumericFormat
                min={0}
                allowNegative={false}
                allowLeadingZeros={false}
                thousandSeparator=","
                customInput={(p) => (
                  <Input className="w-32 text-center" {...p} min={0} />
                )}
                value={state[application.id] ?? 0}
                onBlur={(e) => {
                  e.preventDefault();
                  const value = parseFloat(e.target.value);
                  console.log(value);
                  value !== undefined && set(application.id, value);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
