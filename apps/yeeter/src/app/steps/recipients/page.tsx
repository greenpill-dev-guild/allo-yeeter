'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useYeetForm } from '@/hooks/useYeetForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { slideDefinitions } from '@/app/slideDefinitions';
import { useFormStore } from '@/store/form';
import clipboardy from 'clipboardy';
import {
  RiAddFill,
  RiArrowRightLine,
  RiClipboardLine,
  RiDeleteBin5Line,
  RiUploadCloudFill,
  RiWalletLine,
} from '@remixicon/react';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';

const Addresses = ({}) => {
  const form = useYeetForm();
  const addressValues = useWatch({ control: form.control, name: 'addresses' });
  const formState = useFormStore(state => state);
  const { toast } = useToast();
  const router = useRouter();
  const {
    control,
    formState: { errors },
  } = form;
  const {
    fields: addresses,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  console.log('form addresses', addresses);

  const [isUploading, setIsUploading] = useState(false);

  const handleNext = useCallback(async () => {
    const result = await form.trigger(['addresses']);
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
    console.log(
      'addresses',
      addressValues.map(a => a.address),
    );
    formState.setAddresses(addressValues.map(a => a.address as `0x${string}`));
    router.push('/steps/token');
  }, [form, formState, addresses, router, addressValues, toast]);

  const handlePaste = async (index: number) => {
    try {
      const text = await clipboardy.read();
      form.setValue(`addresses.${index}.address`, text);
      toast({
        title: 'Pasted',
        description: 'Address pasted successfully.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        title: 'Paste Error',
        description: 'Unable to paste from clipboard. Please try manually.',
        variant: 'destructive',
      });
    }
  };

  const handleCSVUpload = useCallback(
    (file: File) => {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        const addresses = content
          .split('\n')
          .filter(address => address.trim() !== '');

        // Clear existing addresses and add new ones
        form.setValue('addresses', []);
        addresses.forEach(address => {
          append({ address: address.trim() });
        });

        setIsUploading(false);
        toast({
          title: 'CSV Uploaded',
          description: `${addresses.length} addresses imported successfully.`,
          variant: 'default',
        });
      };

      reader.onerror = () => {
        setIsUploading(false);
        toast({
          title: 'Upload Error',
          description: 'Failed to read the CSV file. Please try again.',
          variant: 'destructive',
        });
      };

      reader.readAsText(file);
    },
    [append, form, toast],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleCSVUpload(acceptedFiles[0]);
      }
    },
    [handleCSVUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    noClick: true, // Prevent click from opening file dialog
    noDragEventsBubbling: true, // Prevent drag events from bubbling to parent elements
  });

  return (
    <div className="flex gap-4 h-full flex-col items-stretch">
      <StepWrapper className="relative">
        <StepHeader slide={slideDefinitions[0]} />
        <Separator className="my-4" />
        <div {...getRootProps()} className="h-full">
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-foreground flex items-center justify-center z-10">
              <p className="text-foreground font-semibold">
                Drop the CSV file here...
              </p>
            </div>
          )}
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              {addresses.map((field, index) => (
                <FormField
                  key={field.id}
                  control={control}
                  name={`addresses.${index}.address`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <FormLabel>{`Recipient ${index + 1}`}</FormLabel>
                        <FormItem className="flex items-center mb-2">
                          <Input
                            startIcon={RiWalletLine}
                            endIcon={RiClipboardLine}
                            onEndIconClick={() => handlePaste(index)}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                            placeholder="Enter wallet address"
                            className={cn(
                              errors.addresses?.[index]?.address &&
                                'border-red-500',
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                          >
                            <RiDeleteBin5Line className="h-4 w-4" />
                          </Button>
                          <FormMessage />
                        </FormItem>
                      </div>
                    </div>
                  )}
                />
              ))}
              {errors.addresses && (
                <FormMessage className="mt-2">
                  {errors.addresses.message}
                </FormMessage>
              )}
            </div>
            <div className="inline-flex gap-2 mx-auto">
              <Button
                type="button"
                onClick={() => document.getElementById('csvUpload')?.click()}
                className="gap-2"
                disabled={isUploading}
              >
                <RiUploadCloudFill className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload CSV'}
              </Button>
              <Button
                type="button"
                onClick={() => append({ address: '' })}
                className="gap-2"
              >
                <RiAddFill className="w-4 h-4" />
                Add Wallet
              </Button>
            </div>
          </div>
        </div>
      </StepWrapper>
      <div className="inline-flex gap-4">
        <Button onClick={handleNext} className="gap-2">
          Next <RiArrowRightLine className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Addresses;
