"use client";
import { Address, formatUnits } from "viem";
import { formatNumber } from "../lib/utils";
import { useToken } from "../hooks/useToken";

export function TokenAmount({
  amount = BigInt(0),
  token,
  symbol = true,
}: {
  amount: bigint;
  token: Address;
  symbol?: boolean;
}) {
  const { data } = useToken(token);

  return (
    <>
      {formatNumber(Number(formatUnits(amount, data?.decimals)))}{" "}
      {symbol && data?.symbol}
    </>
  );
}
