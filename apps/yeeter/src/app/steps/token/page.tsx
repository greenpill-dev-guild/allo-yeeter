'use client';

import React, { useCallback } from 'react';
import { slideDefinitions } from '../../slideDefinitions';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNetwork, supportedChains } from '@allo-team/kit';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useYeetForm } from '@/hooks/useYeetForm';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCoinFill,
  RiCoinsLine,
  RiGlobalLine,
  RiSpace,
  RiWallet2Line,
  RiWallet3Line,
  RiWalletLine,
} from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { useFormStore } from '@/store/form';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';

const Token = () => {
  const network = useNetwork();
  const form = useYeetForm();
  const { toast } = useToast();
  const router = useRouter();
  const formState = useFormStore(state => state);

  const handleNext = useCallback(async () => {
    const result = await form.trigger(['network', 'token', 'customToken']);
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

    const { network, token, customToken } = form.getValues();
    formState.setNetwork(network);
    if (token) formState.setToken(token as `0x${string}`);
    if (customToken?.address) {
      formState.setCustomToken({
        address: customToken.address as `0x${string}`,
        symbol: customToken.symbol,
        decimals: Number(customToken.decimals),
      });
    }

    router.push('/steps/amount');
  }, [form, formState, router, toast]);

  return (
    <>
      <StepWrapper>
        <StepHeader slide={slideDefinitions[1]} />
        <Separator className="my-6" />
        <div className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Network</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <RiCoinFill className="w-4 h-4" />
                        <SelectValue placeholder="Select network" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {supportedChains?.map(network => (
                        <SelectItem key={network.id} value={String(network.id)}>
                          <div className="flex items-center gap-2">
                            {network.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Token</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <RiGlobalLine className="w-4 h-4" />
                        <SelectValue placeholder="Select token" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        ...(network?.tokens || []),
                        {
                          address: '0xC27eFb147aDfB5273C4AB9201229c80352Ce820d',
                          code: 'CFCE USDC',
                        },
                      ].map(token => (
                        <SelectItem key={token.address} value={token.address}>
                          <div className="flex items-center gap-2">
                            {/* {token.icon && (
                          <div
                            className="w-4 h-4"
                            dangerouslySetInnerHTML={{ __html: token.icon }}
                          />
                        )} */}
                            {token.code}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="!my-6" label="OR ADD TOKEN" />
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="customToken.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Address</FormLabel>
                  <Input
                    {...field}
                    startIcon={RiWalletLine}
                    placeholder="Enter token address"
                    disabled={!!formState.token}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customToken.symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <Input
                    {...field}
                    startIcon={RiCoinsLine}
                    placeholder="Enter token symbol"
                    disabled={!!formState.token}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customToken.decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Decimals</FormLabel>
                  <Input
                    {...field}
                    startIcon={RiSpace}
                    type="number"
                    placeholder="Enter token decimals"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </StepWrapper>
      <div className="inline-flex gap-4">
        <Button onClick={() => router.back()} className="gap-2" variant="ghost">
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

export default Token;
