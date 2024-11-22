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
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { slideDefinitions } from '@/app/slideDefinitions';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiUser2Fill,
  RiUserFill,
} from '@remixicon/react';
import { useRouter } from 'next/navigation';
import { RedirectToSummaryIfCompleted, useFormStore } from '@/store/form';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import RecipientsList from '@/components/recipients/RecipientsList';
import { formatEther } from 'viem';
import SummaryDetails from '@/components/summary/SummaryDetails';

const Amount = () => {
  const form = useFormContext();
  const { token: tokenAddress, addresses, customToken } = form.getValues();
  const amount = form.watch('amount');
  const router = useRouter();
  const { toast } = useToast();
  // Replace token selection logic with the hook
  const token = useSelectedToken();

  // Add this line to get access to the form store
  const formState = useFormStore(state => state);

  const handleNext = useCallback(async () => {
    const result = await form.trigger(['amount']);

    const errors = form.formState.errors;
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
    <>
      <StepWrapper>
        <RedirectToSummaryIfCompleted />
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
                  className="text-right pr-24"
                  inputMode="numeric"
                  step="0.000000000000000001"
                  {...field}
                  value={field.value}
                  onChange={e => {
                    const value = e.target.value;
                    field.onChange(value);
                    formState.setAmount(Number(value));
                  }}
                  placeholder="Enter amount"
                  endContent={
                    <div className="h-full pr-5 flex items-center gap-2">
                      <Separator orientation="vertical" />
                      <span className="text-muted-foreground">
                        {token?.code}
                      </span>
                    </div>
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SummaryDetails />
        <Separator className="my-4" />
        <div className="w-full">
          <RecipientsList />
        </div>
      </StepWrapper>
      <div className="inline-flex gap-4">
        <Button
          onClick={() => router.back()}
          className="gap-2"
          variant={'ghost'}
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext} className="gap-2 flex-1">
          Next <RiArrowRightLine className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default Amount;
