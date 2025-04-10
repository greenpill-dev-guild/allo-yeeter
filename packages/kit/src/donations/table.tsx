"use client";
import { UseQueryResult } from "@tanstack/react-query";
import { Application, Donation, DonationsQuery } from "../api/types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";
import { useDonations } from "../hooks/useDonations";
import { formatMoney } from "../lib/utils";
import { supportedChains } from "../api/web3-provider";
import { formatUnits, getAddress, parseUnits, zeroAddress } from "viem";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { TToken } from "../utils/index";

type Props = {
  query?: DonationsQuery;
};

export function DonationsTableWithHook({ query, ...props }: Props) {
  return <DonationsTable {...useDonations(query)} {...props} />;
}

function findToken(chainId: number, tokenAddress: string) {
  return supportedChains?.reduce(
    (match, chain) => {
      const token = chain.tokens.find(
        (t) => chain.id === chainId && t.address === tokenAddress,
      );

      return token || match;
    },
    { code: "UNKNOWN", decimals: 18 } as TToken,
  );
}

export function DonationsTable({
  data = [],
  isPending,
  error,
}: Partial<UseQueryResult<Donation[] | undefined, unknown>> & Props) {
  const columns: ColumnDef<Donation>[] = useMemo(
    () => [
      {
        accessorKey: "amountInUsd",
        header: "USD",
        cell: ({ row }) => formatMoney(row.getValue("amountInUsd"), "usd", 0),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const { tokenAddress, chainId, amount } = row.original;
          const token = findToken(chainId, tokenAddress);
          return (
            <div>
              {formatUnits(BigInt(amount), token?.decimals)} {token.code}
            </div>
          );
        },
      },

      {
        accessorKey: "donorAddress",
        header: "Donor",
        cell: ({ row }) => <pre>{row.getValue("donorAddress")}</pre>,
      },
      {
        accessorKey: "transactionHash",
        header: "Tx",
        cell: ({ row }) => <Button variant={"ghost"} icon={ExternalLink} />,
      },
    ],
    [],
  );
  return <DataTable isLoading={isPending} columns={columns} data={data} />;
}
