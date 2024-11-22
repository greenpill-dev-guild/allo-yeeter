'use client';

import React from 'react';
import { useYeetForm } from '@/hooks/useYeetForm';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';
import { slideDefinitions } from '@/app/slideDefinitions';
import { Button } from '@/components/ui/button';
import {
  RiAddCircleFill,
  RiArrowLeftLine,
  RiArrowRightUpFill,
  RiFileCopyFill,
} from '@remixicon/react';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import RecipientsList from '@/components/recipients/RecipientsList';
import { TokenIcon } from '@/components/ui/token-icon';
import SummaryDetails from '@/components/summary/SummaryDetails';
import { useRouter } from 'next/navigation';
import YeetDialog from './YeetDialog';
import { useFormStore } from '@/store/form';
import Link from 'next/link';
import { useChains } from 'wagmi';

const Summary = () => {
  const form = useYeetForm();
  const router = useRouter();
  const token = useSelectedToken();
  const yeetTx = useFormStore(state => state.yeetTx);
  const chainId = useFormStore(state => state.network);
  const resetForm = useFormStore(state => state.resetYeetForm);
  const chains = useChains();
  const scannerUrl = chains.find(c => c.id === chainId)?.blockExplorers?.default
    .apiUrl;
  const { amount: totalAmount } = form.getValues();

  return (
    <>
      <StepWrapper>
        <StepHeader slide={slideDefinitions[3]} />
        <Separator className="my-8" label="SUBTOTAL" />
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-semibold">
            {`${Number(totalAmount).toLocaleString()} ${token?.code}`}
          </h2>
          {token && 'icon' in token && (
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
        {!yeetTx ? (
          <>
            <Button
              onClick={() => router.back()}
              className="gap-2"
              variant={'ghost'}
            >
              <RiArrowLeftLine className="w-4 h-4" />
              Back
            </Button>
            <YeetDialog />
          </>
        ) : (
          <>
            <Button
              variant={'outline'}
              onProgress={() => {
                resetForm();
                router.push('/');
              }}
              className="flex-1"
            >
              <RiAddCircleFill className="w-4 h-4 mr-2" /> New Yeet
            </Button>
            {/* TODO: Functionality for the below doesn't exist yet */}
            {/* <Button className="flex-1">
              Share Link <RiFileCopyFill className="w-4 h-4 ml-2" />
            </Button> */}
            <Button variant={'outline'} className="flex-1">
              <Link
                // TODO: handle dynamically
                href={`${scannerUrl}/tx/${yeetTx}`}
                target="_blank"
              >
                <div className="inline-flex items-center">
                  Open Transaction{' '}
                  <RiArrowRightUpFill className="w-4 h-4 ml-2" />
                </div>
              </Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Summary;
