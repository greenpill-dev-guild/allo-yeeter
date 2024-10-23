'use client';

import React, { useCallback } from 'react';
import { useNetwork } from '@allo-team/kit';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useYeetForm } from '@/hooks/useYeetForm';
import { useToast } from '@/hooks/use-toast';
import { slideDefinitions } from '@/app/slideDefinitions';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';
import { useRouter } from 'next/navigation';
import { useFormStore } from '@/store/form';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';

const Amount = () => {
  const form = useYeetForm();
  const { token: tokenAddress, addresses } = form.getValues();
  const amount = form.watch('amount');
  const router = useRouter();
  const { toast } = useToast();
  const network = useNetwork();
  const token = network?.tokens?.find(t => t.address === tokenAddress);
  // construct list of addresses with allocated amounts
  const allocatedAmount = Number(amount) / addresses.length;
  const allocatedAmounts = addresses.map(({ address }) => ({
    address,
    amount: allocatedAmount,
  }));

  // Add this line to get access to the form store
  const formState = useFormStore(state => state);

  const handleNext = useCallback(async () => {
    const result = await form.trigger(['amount']);
    console.log('Validation result:', result);

    const errors = form.formState.errors;
    console.log('Validation errors:', errors);
    const errorMessages = Object.entries(errors)
      .map(([field, error]) => `${field}: ${error?.message}`)
      .join('\n');

    if (errorMessages.length) {
      toast({
        title: 'Validation Error',
        description: errorMessages,
        variant: 'destructive',
      });
      return;
    }

    const { amount } = form.getValues();
    formState.setAmount(amount);

    router.push('/steps/summary');
  }, [form, formState, router, toast]);

  return (
    <div className="flex gap-4 h-full flex-col items-stretch">
      <StepWrapper>
        <StepHeader slide={slideDefinitions[2]} />
        <Separator className="my-4" />
        <div className="w-full">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount to Yeet</FormLabel>
                <Input
                  className="text-right pr-16"
                  inputMode="numeric"
                  step="0.000000000000000001"
                  {...field}
                  placeholder="Enter amount"
                  endContent={
                    <div className="text-muted-foreground pr-5">
                      <Separator orientation="vertical" />
                      {token?.code}
                    </div>
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-4" />
        <div className="w-full">
          <div className="flex flex-col gap-2">
            {allocatedAmounts.map((amount, index) => (
              <div
                key={amount.address}
                className="inline-flex items-center justify-between"
              >
                <div className="flex flex-col gap-2 max-w-32">
                  {`Recipient: ${index + 1}`}
                  <div className="text-muted-foreground text-sm truncate">
                    {amount.address} {token?.code}
                  </div>
                </div>
                <div>{amount.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </StepWrapper>
      <div className="inline-flex gap-4">
        <Button onClick={() => router.back()} className="gap-2">
          <RiArrowLeftLine className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext} className="gap-2">
          Next <RiArrowRightLine className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Amount;
