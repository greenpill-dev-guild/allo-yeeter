import { useNetwork } from "@allo-team/kit";
import { useYeetStore } from "@/store/yeet";

import { TToken } from "../../../kit/src/utils/index";

export const useSelectedToken = ():
  | TToken
  | { address: string; code: string; decimals: number; canVote?: boolean }
  | undefined => {
  const tokenAddress = useYeetStore((state) => state.token);
  const network = useNetwork();

  const token = network?.tokens?.find((t) => t.address === tokenAddress);

  return token;
};
