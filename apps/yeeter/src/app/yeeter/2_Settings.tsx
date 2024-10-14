import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supportedChains, useNetwork } from '@allo-team/kit';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface SettingsProps {
  form: UseFormReturn<YeetFormData>;
}

const Settings: React.FC<SettingsProps> = ({ form }) => {
  const { control, watch } = form;
  const network = useNetwork();
  const customToken = watch('customToken');

  return (
    <div className="w-full max-w-sm space-y-4">
      <FormField
        control={control}
        name="network"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Network</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {supportedChains?.map(network => (
                  <SelectItem key={network.id} value={String(network.id)}>
                    {network.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="token"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {(network?.tokens ?? []).map(token => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Accordion type="single" collapsible>
        <AccordionItem value="custom-token">
          <AccordionTrigger>Or choose a custom token</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <FormField
                control={control}
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
                control={control}
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
                control={control}
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
  );
};

export default Settings;
