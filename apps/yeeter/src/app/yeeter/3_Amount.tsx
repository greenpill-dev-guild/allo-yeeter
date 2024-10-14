import React from 'react';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AmountProps {
  form: UseFormReturn<YeetFormData>;
}

const Amount: React.FC<AmountProps> = ({ form }) => {
  const { control } = form;

  return (
    <div className="w-full max-w-sm">
      <FormField
        control={control}
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
    </div>
  );
};

export default Amount;
