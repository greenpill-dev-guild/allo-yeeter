import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import { Trash2, Clipboard } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { SlideProps } from './slideDefinitions';

interface AddressesProps extends SlideProps {
  form: UseFormReturn<YeetFormData>;
}

const Addresses: React.FC<AddressesProps> = ({
  form,
  swiper,
  toast,
  fieldsToValidate,
  nextButtonText,
}) => {
  const {
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

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

  const handlePaste = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText();
      form.setValue(`addresses.${index}.address`, text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        title: 'Paste Error',
        description: 'Unable to paste from clipboard. Please try manually.',
        variant: 'destructive',
      });
    }
  };

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
              <div className="flex-grow mr-2 relative">
                <Input
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  placeholder="Enter wallet address"
                  className={cn(
                    'pr-10',
                    errors.addresses?.[index]?.address && 'border-red-500',
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => handlePaste(index)}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
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
      <Button onClick={handleNext} className="mt-4">
        {nextButtonText}
      </Button>
    </div>
  );
};

export default Addresses;
