'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useYeetForm } from '@/hooks/useYeetForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { slideDefinitions } from '@/app/slideDefinitions';
import { RedirectToSummaryIfCompleted, useFormStore } from '@/store/form';
import clipboardy from 'clipboardy';
import {
  RiAddFill,
  RiArrowRightLine,
  RiClipboardLine,
  RiDeleteBin5Line,
  RiUploadCloud2Line,
  RiWalletLine,
} from '@remixicon/react';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';

const Addresses = ({}) => {
  const form = useFormContext();
  const addressValues: { address: `0x${string}` }[] = useWatch({
    control: form.control,
    name: 'addresses',
  });
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

  const [isUploading, setIsUploading] = useState(false);

  const handleNext = useCallback(async () => {
    const isValid = await form.trigger('addresses');

    if (!isValid) {
      const errorMessages = Object.entries(form.formState.errors)
        .map(([field, error]) => `${field}: ${error?.message}`)
        .join('\n');

      toast({
        title: 'Validation Error',
        description: errorMessages,
        variant: 'destructive',
      });
      return;
    }
    formState.setAddresses(addressValues.map(a => a.address as `0x${string}`));
    router.push('/steps/token');
  }, [form, formState, addressValues, router, toast]);

  const handlePaste = async (index: number) => {
    try {
      const text = await clipboardy.read();
      form.setValue(`addresses.${index}.address`, text);
      form.trigger(`addresses.${index}.address`);
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
        form.trigger('addresses');
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
    <>
      <StepWrapper className="relative">
        <RedirectToSummaryIfCompleted />
        <StepHeader slide={slideDefinitions[0]} />
        <Separator className="my-6" />
        <div {...getRootProps()} className="h-full">
          <input {...getInputProps()} id="csvUpload" />
          {isDragActive && (
            <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-foreground flex items-center justify-center z-10">
              <p className="text-foreground font-semibold">
                Drop the CSV file here...
              </p>
            </div>
          )}
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 mb-2">
              {addresses.map((field, index) => (
                <FormField
                  key={field.id}
                  control={control}
                  name={`addresses.${index}.address`}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => {
                    // Get both individual and array errors
                    console.log({ error });
                    return (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>{`Recipient ${index + 1}`}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              startIcon={RiWalletLine}
                              endIcon={RiClipboardLine}
                              onEndIconClick={() => handlePaste(index)}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              ref={ref}
                              placeholder="Enter wallet address"
                              className={cn(error && 'border-red-500')}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-14 !mt-0"
                            onClick={() => remove(index)}
                          >
                            <RiDeleteBin5Line className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <div className="inline-flex gap-2 mx-auto pb-2">
              <Button
                type="button"
                onClick={() => document.getElementById('csvUpload')?.click()}
                className="gap-2"
                disabled={isUploading}
                variant={'outline'}
              >
                <RiUploadCloud2Line className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload CSV'}
              </Button>
              <Button
                type="button"
                onClick={() => append({ address: '' })}
                className="gap-2"
                variant={'outline'}
              >
                <RiAddFill className="w-4 h-4" />
                Add Wallet
              </Button>
            </div>
          </div>
        </div>
      </StepWrapper>
      <div className="inline-flex gap-4">
        <Button onClick={handleNext} className="gap-2 flex-1">
          Next <RiArrowRightLine className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
};

export default Addresses;
