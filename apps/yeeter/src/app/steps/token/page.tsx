'use client';

import React, { useCallback, useEffect } from 'react';
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
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCoinsLine,
  RiGlobalLine,
  RiSpace,
  RiWalletLine,
} from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { RedirectToSummaryIfCompleted, useFormStore } from '@/store/form';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';
import { TokenIcon } from '@/components/ui/token-icon';

const Token = () => {
  const network = useNetwork();
  const form = useFormContext();
  // const form = useYeetForm();
  const { toast } = useToast();
  const router = useRouter();
  const formState = useFormStore(state => state);
  const selectedToken = form.watch('token');
  const selectedNetworkId = form.watch('network');
  const selectedNetwork = supportedChains.find(
    n => n.id === Number(selectedNetworkId),
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('customToken.')) {
        form.trigger([
          'customToken.address',
          'customToken.code',
          'customToken.decimals',
        ]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      const errors = form.formState.errors;
      const values = form.getValues();
      console.log('Form state:', {
        errors,
        values,
        isDirty: form.formState.isDirty,
        isValid: form.formState.isValid,
      });
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const resetCustomToken = useCallback(() => {
    // First clear visual state
    form.setValue('customToken.address', '', { shouldValidate: false });
    form.setValue('customToken.code', '', { shouldValidate: false });
    form.setValue('customToken.decimals', '', { shouldValidate: false });

    // Then reset form state
    form.setValue('customToken', undefined, { shouldValidate: true });
  }, [form]);

  const resetToken = useCallback(() => {
    // First clear visual state
    form.setValue('token', '', { shouldValidate: false });
    // Then reset form state
    form.setValue('token', undefined, { shouldValidate: false });
  }, [form]);

  const handleNext = useCallback(async () => {
    const result = await form.trigger([
      'network',
      'token',
      'customToken.address',
      'customToken.code',
      'customToken.decimals',
    ]);

    const errors = form.formState.errors;
    console.log({ result, errors });

    const createErrorMessages = (errors: Record<string, any>): string => {
      if (typeof errors === 'object' && errors !== null) {
        return Object.entries(errors)
          .map(([field, error]) => {
            if (error?.message) {
              return `${field}: ${error.message}\n`;
            }
            return `${field}:\n ${createErrorMessages(error)}`;
          })
          .join('\n');
      }
      return String(errors);
    };

    const errorMessages = createErrorMessages(errors);
    const hasOnlyCustomTokenError =
      errorMessages.includes('customToken') && Object.keys(errors).length === 1;

    if (errorMessages.length && !hasOnlyCustomTokenError) {
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

    if (
      customToken &&
      customToken.address &&
      customToken.code &&
      customToken.decimals
    ) {
      formState.setCustomToken({
        address: customToken.address as `0x${string}`,
        code: customToken.code,
        decimals: customToken.decimals,
      });
    }

    router.push('/steps/amount');
  }, [form, formState, router, toast]);

  return (
    <>
      <StepWrapper>
        <RedirectToSummaryIfCompleted />
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
                    onValueChange={value => {
                      formState.setNetwork(Number(value));
                      field.onChange(Number(value));
                    }}
                    defaultValue={`${field.value}`}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        {!selectedNetwork && (
                          <RiGlobalLine className="w-4 h-4" />
                        )}
                        <SelectValue placeholder="Select network" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {supportedChains?.map(network => (
                        <SelectItem key={network.id} value={String(network.id)}>
                          <div className="flex items-center gap-2">
                            <TokenIcon icon={network.icon} />
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
                    value={field.value || ''}
                    onValueChange={value => {
                      resetCustomToken();
                      field.onChange(value as `0x${string}`);
                    }}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        {!field.value && <RiCoinsLine className="w-4 h-4" />}
                        <SelectValue placeholder="Select token">
                          {field.value &&
                            network?.tokens?.find(
                              t => t.address === field.value,
                            ) && (
                              <div className="flex items-center gap-2">
                                <TokenIcon
                                  icon={
                                    network.tokens.find(
                                      t => t.address === field.value,
                                    )?.icon
                                  }
                                />
                                {
                                  network.tokens.find(
                                    t => t.address === field.value,
                                  )?.code
                                }
                              </div>
                            )}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {network?.tokens?.map(token => (
                        <SelectItem key={token.address} value={token.address}>
                          <div className="flex items-center gap-2">
                            <TokenIcon icon={token.icon} />
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
                    onChange={e => {
                      field.onChange(e.target.value);
                      if (e.target.value) {
                        resetToken();
                      }
                    }}
                    startIcon={RiWalletLine}
                    placeholder="Enter token address"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customToken.code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <Input
                    {...field}
                    onChange={e => {
                      field.onChange(e.target.value);
                      if (e.target.value) {
                        resetToken();
                      }
                    }}
                    startIcon={RiCoinsLine}
                    placeholder="Enter token symbol"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="customToken.decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Decimals</FormLabel>
                  <Input
                    {...field}
                    onChange={e => {
                      field.onChange(e.target.value);
                      if (e.target.value) {
                        form.setValue('token', '', { shouldValidate: false });
                        form.setValue('token', undefined, {
                          shouldValidate: false,
                        });
                      }
                    }}
                    startIcon={RiSpace}
                    inputMode="numeric"
                    placeholder="Enter token decimals"
                  />
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
