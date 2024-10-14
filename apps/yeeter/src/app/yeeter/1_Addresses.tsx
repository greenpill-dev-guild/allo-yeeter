import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import { Trash2 } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface AddressesProps {
  form: UseFormReturn<YeetFormData>;
}

const Addresses: React.FC<AddressesProps> = ({ form }) => {
  const {
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  return (
    <div className="w-full max-w-sm">
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`addresses.${index}.address`}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <FormItem className="flex items-center mb-2">
              <FormLabel className="sr-only">Wallet Address</FormLabel>
              <Input
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
                placeholder="Enter wallet address"
                className={cn(
                  'flex-grow mr-2',
                  errors.addresses?.[index]?.address && 'border-red-500',
                )}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button type="button" onClick={() => append({ address: '' })}>
        Add Wallet
      </Button>
      <FormDescription className="mt-4">
        Enter Ethereum addresses starting with '0x'. Addresses must be 42
        characters long when filled.
      </FormDescription>
      {errors.addresses && (
        <FormMessage className="mt-2">{errors.addresses.message}</FormMessage>
      )}
    </div>
  );
};

export default Addresses;
