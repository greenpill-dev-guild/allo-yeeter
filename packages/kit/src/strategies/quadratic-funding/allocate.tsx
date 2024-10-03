import { getAddress as alloAddress } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { DonationVotingMerkleDistributionStrategy } from "@allo-team/allo-v2-sdk";
import type { Address, Chain, WalletClient } from "viem";
import { getAddress } from "viem";
import type { API, Application, Round } from "../../api/types";
import {
  Permit2Data,
  PermitType,
} from "@allo-team/allo-v2-sdk/dist/strategies/DonationVotingMerkleDistributionStrategy/types";

type Allocation = {
  token: `0x${string}`;
  recipientId: `0x${string}`;
  amount: bigint;
};

export const call = (
  round: Round,
  state: Record<string, number>,
  applications: Application[],
  api: API,
  signer: WalletClient,
) => {
  const allocations: Allocation[] = buildAllocations(
    round.matching.token,
    state,
    applications,
  );
  const [[recipientId, amount]] = Object.entries(state);

  /*
  TODO:
  Implement Permit2
  */
  const permit = {
    nonce: BigInt(0),
    deadline: BigInt(0),
    permitted: { token: round.token, amount: BigInt(amount) },
  } as Permit2Data["permit"];
  // TODO: Sign permit2 message:  signer.signMessage(permit)
  const signature = "0x";
  const permit2Data: Permit2Data = {
    permit,
    signature,
  };
  const tx =
    DonationVotingMerkleDistributionStrategy.prototype.getAllocateData.call(
      {
        poolId: BigInt(round.id),
        checkPoolId: Function,
        allo: { address: () => alloAddress({ id: round.chainId } as Chain) },
      },
      {
        recipientId: getAddress(recipientId),
        permitType: PermitType.Permit2,
        permit2Data,
      },
    );

  return api.allo.sendTransaction(tx, signer);
};

function buildAllocations(
  token: Address,
  state: Record<string, number>,
  applications: Application[],
) {
  return Object.entries(state)
    .filter(([_, amount]) => amount > 0)
    .map(([projectId, amount]) => {
      const application = applications.find(
        (appl) => appl.projectId === projectId,
      );
      return {
        token,
        recipientId: getAddress(application?.recipient!),
        amount: BigInt(amount),
      };
    });
}
