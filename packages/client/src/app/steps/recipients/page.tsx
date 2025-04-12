"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { slideDefinitions } from "@/app/slideDefinitions";
import { RedirectToSummaryIfCompleted, useFormStore } from "@/store/form";
import clipboardy from "clipboardy";
import {
  RiAddFill,
  RiArrowRightLine,
  RiClipboardLine,
  RiCoinsLine,
  RiCurrencyLine,
  RiDeleteBin5Line,
  RiGlobalLine,
  RiSpace,
  RiUploadCloud2Line,
  RiWalletLine,
} from "@remixicon/react";

import StepWrapper from "@/components/step/StepWrapper";
import StepHeader from "@/components/step/StepHeader";
import { supportedChains, useNetwork } from "@allo-team/kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenIcon } from "@/components/ui/token-icon";
import { Separator } from "@/components/ui/separator";
import { useSelectedToken } from "@/hooks/useSelectedToken";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const Addresses = ({}) => {
  const network = useNetwork();
  const router = useRouter();

  const { toast } = useToast();
  const token = useSelectedToken();

  const form = useFormContext();
  const formState = useFormStore((state) => state);
  const addressValues: { address: `0x${string}` }[] = useWatch({
    control: form.control,
    name: "addresses",
  });
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
    name: "addresses",
  });

  const [isUploading, setIsUploading] = useState(false);

  const selectedNetworkId = form.watch("network");
  const selectedNetwork = supportedChains.find(
    (n) => n.id === Number(selectedNetworkId)
  );

  const tokens = useMemo(() => {
    if (network?.tokens) {
      console.log("network.tokens", network.tokens);
      return network.tokens.filter((t) => t.address !== ZERO_ADDRESS);
    }
    return [];
  }, [network]);

  const handlePaste = async (index: number) => {
    try {
      const text = await clipboardy.read();
      form.setValue(`addresses.${index}.address`, text);
      form.trigger(`addresses.${index}.address`);
      toast({
        title: "Pasted",
        description: "Address pasted successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      toast({
        title: "Paste Error",
        description: "Unable to paste from clipboard. Please try manually.",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = useCallback(
    (file: File) => {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const addresses = content
          .split("\n")
          .filter((address) => address.trim() !== "");

        // Clear existing addresses and add new ones
        form.setValue("addresses", []);
        addresses.forEach((address) => {
          append({ address: address.trim() });
        });

        setIsUploading(false);
        toast({
          title: "CSV Uploaded",
          description: `${addresses.length} addresses imported successfully.`,
          variant: "default",
        });
        form.trigger("addresses");
      };

      reader.onerror = () => {
        setIsUploading(false);
        toast({
          title: "Upload Error",
          description: "Failed to read the CSV file. Please try again.",
          variant: "destructive",
        });
      };

      reader.readAsText(file);
    },
    [append, form, toast]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleCSVUpload(acceptedFiles[0]);
      }
    },
    [handleCSVUpload]
  );

  const resetCustomToken = useCallback(() => {
    // First clear visual state
    form.setValue("customToken.address", "", { shouldValidate: false });
    form.setValue("customToken.code", "", { shouldValidate: false });
    form.setValue("customToken.decimals", "", { shouldValidate: false });

    // Then reset form state
    form.setValue("customToken", undefined, { shouldValidate: true });
  }, [form]);

  const resetToken = useCallback(() => {
    // First clear visual state
    form.setValue("token", "", { shouldValidate: false });
    // Then reset form state
    form.setValue("token", undefined, { shouldValidate: false });
  }, [form]);

  const handleYeet = useCallback(async () => {
    const isValid = await form.trigger("addresses");

    if (!isValid) {
      const errorMessages = Object.entries(form.formState.errors)
        .map(([field, error]) => `${field}: ${error?.message}`)
        .join("\n");

      toast({
        title: "Validation Error",
        description: errorMessages,
        variant: "destructive",
      });
      return;
    }

    formState.setAddresses(
      addressValues.map((a) => a.address as `0x${string}`)
    );
    router.push("/steps/token");

    // const createErrorMessages = (errors: Record<string, any>): string => {
    //   if (typeof errors === 'object' && errors !== null) {
    //     return Object.entries(errors)
    //       .map(([field, error]) => {
    //         if (error?.message) {
    //           return `${field}: ${error.message}\n`;
    //         }
    //         return `${field}:\n ${createErrorMessages(error)}`;
    //       })
    //       .join('\n');
    //   }
    //   return String(errors);
    // };

    // await form.trigger([
    //   'network',
    //   'token',
    //   'customToken.address',
    //   'customToken.code',
    //   'customToken.decimals',
    // ]);

    // const errors = form.formState.errors;

    // const errorMessages = createErrorMessages(errors);

    // if (errorMessages) {
    //   console.log('errorMessages', errorMessages);
    //   toast({
    //     title: 'Validation Error',
    //     description: errorMessages,
    //     variant: 'destructive',
    //     className: 'whitespace-pre-wrap',
    //   });
    //   return;
    // }

    // const { network, token, customToken } = form.getValues();
    // formState.setNetwork(network);
    // if (token) formState.setToken(token as `0x${string}`);

    // if (!token && !customToken?.address) {
    //   toast({
    //     title: 'Validation Error',
    //     description: 'Token is required',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    // if (customToken?.address && (!customToken.code || !customToken.decimals)) {
    //   toast({
    //     title: 'Validation Error',
    //     description: 'Token symbol and decimals are required',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    // if (
    //   customToken &&
    //   customToken.address &&
    //   customToken.code &&
    //   customToken.decimals
    // ) {
    //   formState.setCustomToken({
    //     address: customToken.address as `0x${string}`,
    //     code: customToken.code,
    //     decimals: customToken.decimals,
    //   });
    // }

    // router.push('/steps/amount');
  }, [form, formState, addressValues, router, toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    noClick: true, // Prevent click from opening file dialog
    noDragEventsBubbling: true, // Prevent drag events from bubbling to parent elements
  });

  return (
    <>
      <StepWrapper className="relative flex flex-col">
        {/* <RedirectToSummaryIfCompleted /> */}
        {/* { <StepHeader slide={slideDefinitions[0]} />} */}
        <div className="flex gap-4 items-center mt-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                {/* <FormLabel>Total amount to yeet</FormLabel> */}
                <Input
                  className="text-right pr-24"
                  inputMode="numeric"
                  step="0.000000000000000001"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    formState.setAmount(Number(value));
                  }}
                  placeholder="Yeet Amount"
                  endContent={
                    <div className="h-full pr-5 flex items-center gap-2">
                      <Separator orientation="vertical" />
                      <span className="text-muted-foreground">
                        {token?.code}
                      </span>
                    </div>
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="flex-1">
                {/* <FormLabel>Token</FormLabel> */}
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    resetCustomToken();
                    field.onChange(value as `0x${string}`);
                    formState.setToken(value as `0x${string}`);
                  }}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      {!field.value && <RiCoinsLine className="w-4 h-4" />}
                      <SelectValue placeholder="Select token">
                        {field.value &&
                          tokens?.find((t) => t.address === field.value) && (
                            <div className="flex items-center gap-2">
                              <TokenIcon
                                icon={
                                  tokens.find((t) => t.address === field.value)
                                    ?.icon
                                }
                              />
                              {
                                tokens.find((t) => t.address === field.value)
                                  ?.code
                              }
                            </div>
                          )}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {tokens?.map((token) => (
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
        <div className="inline-flex items-center justify-center gap-2 my-3 w-full">
          <Button
            type="button"
            onClick={() => document.getElementById("csvUpload")?.click()}
            className="gap-2"
            disabled={isUploading}
            variant={"outline"}
          >
            <RiUploadCloud2Line className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload CSV"}
          </Button>
          <Button
            type="button"
            onClick={() => append({ address: "" })}
            className="gap-2"
            variant={"outline"}
          >
            <RiAddFill className="w-4 h-4" />
            Add Wallet
          </Button>
        </div>
        <Button onClick={handleYeet} className="gap-2 flex-1 w-full">
          Next <RiArrowRightLine className="w-4 h-4" />
        </Button>
        <div {...getRootProps()} className="h-full overflow-y-scroll">
          <input {...getInputProps()} id="csvUpload" />
          <div className="flex flex-col flex-1 h-full gap-2 mb-2">
            {addresses.map((field, index) => (
              <FormItem className={cn("", index === 0 && "mt-6")}>
                <FormLabel>{`Recipient ${index + 1}`}</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    key={field.id}
                    control={control}
                    name={`addresses.${index}.address`}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => {
                      return (
                        <FormControl>
                          <Input
                            startIcon={RiWalletLine}
                            endIcon={RiClipboardLine}
                            onEndIconClick={() => handlePaste(index)}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                            placeholder="Enter Wallet Address"
                            wrapperClassName="flex-[2]"
                            className={cn(error && "border-red-500")}
                          />
                        </FormControl>
                      );
                    }}
                  />
                  <FormField
                    key={field.id}
                    control={control}
                    name={`recipients.${index}.amount`}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { error },
                    }) => {
                      return (
                        <FormControl>
                          <Input
                            startIcon={RiCurrencyLine}
                            endIcon={RiClipboardLine}
                            onEndIconClick={() => handlePaste(index)}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                            inputMode="numeric"
                            step="0.000000000000000001"
                            // onChange={(e) => {
                            //   const value = e.target.value;
                            //   onChange(value);
                            //   formState.setAmount(Number(value));
                            // }}
                            placeholder="Amount"
                            wrapperClassName="flex-[1]"
                            className={cn(error && "border-red-500")}
                            {...field}
                          />
                        </FormControl>
                      );
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 w-14 !mt-0"
                    onClick={() => remove(index)}
                  >
                    <RiDeleteBin5Line className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            ))}
          </div>
        </div>
      </StepWrapper>
    </>
  );
};

export default Addresses;
