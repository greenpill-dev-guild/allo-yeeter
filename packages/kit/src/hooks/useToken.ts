import { type Address, erc20Abi, getAddress, zeroAddress } from "viem";
import { useBalance, useReadContracts } from "wagmi";
import { NATIVE } from "@allo-team/allo-v2-sdk";

export const isNativeToken = (token?: Address) =>
  [zeroAddress, NATIVE].includes(token?.toLowerCase()!);

export function useToken(tokenAddress?: Address): any {
  const address = tokenAddress ? getAddress(tokenAddress) : undefined;
  const tokenContract = { address, abi: erc20Abi };

  const token = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...tokenContract, functionName: "decimals" },
      { ...tokenContract, functionName: "symbol" },
    ],
  });

  const [decimals = 18, symbol = "ETH"] = token.data ?? [];
  return {
    ...token,
    data: { address, symbol, decimals },
  };
}

export function useTokenBalance(opts: { address?: Address; token?: Address }) {
  const token = isNativeToken(opts.token) ? undefined : opts.token;

  return useBalance({ address: opts.address, token });
}
