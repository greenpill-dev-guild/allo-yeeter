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
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';
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
    const result = await form.trigger(['network', 'token']);
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
    formState.setToken(token as `0x${string}`);
    // formState.setCustomToken(customToken);

    router.push('/steps/amount');
  }, [form, formState, router, toast]);

  return (
    <div className="flex gap-4 h-full flex-col items-stretch">
      <StepWrapper>
        <StepHeader slide={slideDefinitions[1]} />
        <Separator className="my-4" />
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
                      <SelectValue placeholder="Select network" />
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
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        [
                          ...(network?.tokens ?? []),
                          {
                            address:
                              '0xC27eFb147aDfB5273C4AB9201229c80352Ce820d',
                            code: 'CFCE USDC',
                          },
                        ] ?? []
                      ).map(token => (
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

          <Accordion type="single" collapsible>
            <AccordionItem value="custom-token">
              <AccordionTrigger>Or choose a custom token</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="customToken.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Address</FormLabel>
                        <Input {...field} placeholder="Enter token address" />
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
                        <Input {...field} placeholder="Enter token symbol" />
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
                          type="number"
                          placeholder="Enter token decimals"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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

export default Token;
