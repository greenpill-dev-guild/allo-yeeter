import { useNetwork } from "@allo-team/kit";
import { useFormStore } from "@/store/form";
import { TToken } from "../../../../packages/kit/src/utils/index";

export const useSelectedToken = ():
  | TToken
  | { address: string; code: string; decimals: number; canVote?: boolean }
  | undefined => {
  const tokenAddress = useFormStore((state) => state.token);
  const customToken = useFormStore((state) => state.customToken);
  const network = useNetwork();

  if (customToken) {
    const { address, code, decimals } = customToken;
    if (
      typeof address === "string" &&
      typeof code === "string" &&
      typeof decimals === "number"
    ) {
      return {
        address,
        code,
        decimals,
        canVote: customToken.canVote,
      };
    }
  }

  const token = network?.tokens?.find((t) => t.address === tokenAddress);

  return token;
};
