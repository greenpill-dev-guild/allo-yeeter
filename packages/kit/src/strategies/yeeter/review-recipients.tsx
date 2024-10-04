import type { Address, WalletClient } from "viem";

import { DirectGrantsLiteStrategy } from "@allo-team/allo-v2-sdk/";
import type { API } from "../../api/types";

export const call = (
  applicationIds: string[],
  selected: string[],
  strategy: Address,
  statusValue: bigint,
  api: API,
  signer: WalletClient,
) => {
  const statuses: { index: bigint; statusRow: bigint }[] = applicationIds.map(
    (applicationId) => ({
      index: BigInt(applicationId),
      statusRow: selected.includes(applicationId) ? statusValue : BigInt(0),
    }),
  );
  const refRecipientsCounter = BigInt(statuses.length);

  const tx = DirectGrantsLiteStrategy.prototype.reviewRecipients.call(
    { strategy },
    statuses,
    refRecipientsCounter,
  );

  return api.allo.sendTransaction(tx, signer);
};
