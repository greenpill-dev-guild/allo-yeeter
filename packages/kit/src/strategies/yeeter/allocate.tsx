import { getAddress as alloAddress } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { YeeterStrategy } from "@allo-team/allo-v2-sdk";
import type { Address, Chain, WalletClient } from "viem";
import { getAddress } from "viem";
import type { API, Application, Round } from "../../api/types";

type Allocation = {
  token: `0x${string}`;
  recipientIds: `0x${string}`[];
  amounts: bigint[];
};

export const call = (
  round: Round,
  state: Allocation,
  applications: Application[],
  api: API,
  signer: WalletClient,
) => {
  const tx = YeeterStrategy.prototype.getAllocateData.call(
    {
      poolId: BigInt(round.id),
      checkPoolId: Function,
      allo: { address: () => alloAddress({ id: round.chainId } as Chain) },
    },
    state,
  );

  return api.allo.sendTransaction(tx, signer);
};
