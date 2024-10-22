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
import { Input } from '@/components/ui/input';

const Amount: React.FC<SlideProps> = ({
  form,
  swiper,
  toast,
  fieldsToValidate,
  nextButtonText,
}) => {
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
    <div className="w-full max-w-sm">
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount to Yeet</FormLabel>
            <Input
              type="number"
              step="0.000000000000000001"
              {...field}
              placeholder="Enter amount"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <Button onClick={handleNext}>{nextButtonText}</Button>
    </div>
  );
};

export default Amount;
