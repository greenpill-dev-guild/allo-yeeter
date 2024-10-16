import React from 'react';
import { SlideProps } from './slideDefinitions';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

const Settings: React.FC<SlideProps> = ({
  form,
  swiper,
  toast,
  fieldsToValidate,
  nextButtonText,
}) => {
  const network = useNetwork();
  const handleNext = async () => {
    const result = await form.trigger(fieldsToValidate);
    console.log('Validation result:', result);

    if (result) {
      swiper?.slideNext();
    } else {
      const errors = form.formState.errors;
      console.log('Validation errors:', errors);

      const errorMessages = Object.entries(errors)
        .map(([field, error]) => `${field}: ${error?.message}`)
        .join('\n');

      toast({
        title: 'Validation Error',
        description: errorMessages,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
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
        control={form.control}
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
      <Button onClick={handleNext}>{nextButtonText}</Button>
    </div>
  );
};

export default Settings;
