"use client";

import {
  RiAddCircleFill,
  RiArrowLeftLine,
  RiArrowRightUpFill,
} from "@remixicon/react";
import React from "react";
import Link from "next/link";
import { useChains } from "wagmi";
import { useRouter } from "next/navigation";

import { slideDefinitions } from "@/components/step/slideDefinitions";

import { useYeetStore } from "@/store/yeet";
import { useYeetForm } from "@/hooks/useYeetForm";
import { useSelectedToken } from "@/hooks/useSelectedToken";

import { Button } from "@/components/ui/button";
import { TokenIcon } from "@/components/ui/token-icon";
import { Separator } from "@/components/ui/separator";
import StepHeader from "@/components/step/StepHeader";
import StepWrapper from "@/components/step/StepWrapper";
import SummaryDetails from "@/components/summary/SummaryDetails";
import RecipientsList from "@/components/recipients/RecipientsList";

const YeetSend = () => {
  const router = useRouter();

  const chains = useChains();
  const token = useSelectedToken();

  const { reset: resetYeetForm } = useYeetForm();
  const yeetTx = useYeetStore((state) => state.yeetTx);
  const chainId = useYeetStore((state) => state.network);
  const resetForm = useYeetStore((state) => state.resetYeetForm);

  const scannerUrl = chains.find((c) => c.id === chainId)?.blockExplorers
    ?.default.url;
  const totalAmount = useYeetStore((state) => state.amount);

  return (
    <>
      <StepWrapper>
        <StepHeader slide={slideDefinitions[3]} />
        <Separator className="my-8" label="SUBTOTAL" />
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-semibold">
            {`${Number(totalAmount).toLocaleString()} ${token?.code}`}
          </h2>
          {token && "icon" in token && (
            <TokenIcon icon={token?.icon} className="w-14 h-14" />
          )}
        </div>
        <SummaryDetails />
        <Separator label="RECIPIENTS" className="my-8" />
        <div className="w-full">
          <RecipientsList />
        </div>
      </StepWrapper>
      <div className="flex flex-row gap-2">
        {!yeetTx ?
          <>
            <Button
              onClick={() => router.back()}
              className="gap-2"
              variant={"ghost"}
            >
              <RiArrowLeftLine className="w-4 h-4" />
              Back
            </Button>
          </>
        : <>
            <Button
              variant={"outline"}
              onClick={() => {
                resetForm();
                resetYeetForm();
                router.push("/");
              }}
              className="flex-1"
            >
              <RiAddCircleFill className="w-4 h-4 mr-2" /> New Yeet
            </Button>
            {/* TODO: Functionality for the below doesn't exist yet */}
            {/* <Button className="flex-1">
              Share Link <RiFileCopyFill className="w-4 h-4 ml-2" />
            </Button> */}
            <Button variant={"outline"} className="flex-1">
              <Link
                // TODO: handle dynamically
                href={`${scannerUrl}/tx/${yeetTx}`}
                target="_blank"
              >
                <div className="inline-flex items-center">
                  Open Transaction{" "}
                  <RiArrowRightUpFill className="w-4 h-4 ml-2" />
                </div>
              </Link>
            </Button>
          </>
        }
      </div>
    </>
  );
};

export default YeetSend;
