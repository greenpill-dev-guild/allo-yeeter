"use client";

import {
  RiAddFill,
  RiClipboardLine,
  RiCoinsLine,
  RiCurrencyLine,
  RiDeleteBin5Line,
  RiSendPlaneFill,
  RiUploadCloud2Line,
  RiWalletLine,
} from "@remixicon/react";
import clipboardy from "clipboardy";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useNetwork } from "@allo-team/kit";

import { RedirectToSummaryIfCompleted, useYeetStore } from "@/store/yeet";

import { useToast } from "@/hooks/useToast";
import { useSelectedToken } from "@/hooks/useSelectedToken";

import { cn } from "@/lib/utils";
// import { slideDefinitions } from "@/app/slideDefinitions";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import StepHeader from "@/components/step/StepHeader";
import StepWrapper from "@/components/step/StepWrapper";
import { TokenIcon } from "@/components/ui/token-icon";
import { Separator } from "@/components/ui/separator";
import { YeetFormData } from "@/hooks/useYeetForm";

import YeetDialog from "../../../components/YeetDialog";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const YeetLoadPage = ({}) => {
  const network = useNetwork();

  const yeetState = useYeetStore((state) => state);
  const amountSplitType = useYeetStore((state) => state.amountSplitType);

  const { toast } = useToast();
  const token = useSelectedToken();

  const form = useFormContext<YeetFormData>();
  const recipientValues = useWatch({
    control: form.control,
    name: "recipients",
  });
  const {
    fields: recipients,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "recipients",
  });

  const [isCSVUploading, setIsCSVUploading] = useState(false);
  const [openYeetDialog, setYeetDialogOpen] = useState(false);

  const tokens = useMemo(() => {
    if (network?.tokens) {
      return network.tokens.filter((t) => t.address !== ZERO_ADDRESS);
    }
    return [];
  }, [network]);

  const handlePaste = (type: "address" | "amount") => async (index: number) => {
    try {
      const text = await clipboardy.read();

      if (type === "amount") {
        form.setValue(`recipients.${index}.amount`, parseInt(text));
        form.trigger(`recipients.${index}.amount`);
      } else {
        form.setValue(`recipients.${index}.address`, text);
        form.trigger(`recipients.${index}.address`);
      }

      toast({
        title: "Pasted",
        description: "Address pasted successfully.",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Paste Error",
        description: "Unable to paste from clipboard. Please try manually.",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = useCallback(
    (file: File) => {
      setIsCSVUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const addresses = content
          .split("\n")
          .filter((address) => address.trim() !== "");

        // Clear existing recipients and add new ones
        form.setValue("recipients", []);
        addresses.forEach((address) => {
          append({ address: address.trim(), amount: 0 });
        });

        setIsCSVUploading(false);
        toast({
          title: "CSV Uploaded",
          description: `${addresses.length} addresses imported successfully.`,
          variant: "default",
        });
        form.trigger("recipients");
      };

      reader.onerror = () => {
        setIsCSVUploading(false);
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

  const handleYeet = useCallback(async () => {
    const isValid = await form.trigger(["amount", "token", "recipients"]);

    if (!isValid) {
      const createErrorMessages = (errors: Record<string, any>): string => {
        if (typeof errors === "object" && errors !== null) {
          return Object.entries(errors)
            .map(([field, error]) => {
              if (error?.message) {
                return `${field}: ${error.message}\n`;
              }
              return `${field}:\n ${createErrorMessages(error)}`;
            })
            .join("\n");
        }
        return String(errors);
      };

      const errors = form.formState.errors;
      const errorMessages = createErrorMessages(errors);

      toast({
        title: "Validation Error",
        description: errorMessages,
        variant: "destructive",
        className: "whitespace-pre-wrap",
      });
      return;
    }

    const { token } = form.getValues();
    network && yeetState.setNetwork(network.id);
    if (token) yeetState.setToken(token as `0x${string}`);

    if (!token) {
      toast({
        title: "Validation Error",
        description: "Token is required",
        variant: "destructive",
      });
      return;
    }

    yeetState.setRecipients(recipientValues);

    setYeetDialogOpen(true);
  }, [form, yeetState, recipientValues, toast]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleCSVUpload(acceptedFiles[0]);
      }
    },
    [handleCSVUpload]
  );

  const { getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    noClick: true, // Prevent click from opening file dialog
    noDragEventsBubbling: true, // Prevent drag events from bubbling to parent elements
  });

  useEffect(() => {
    if (token && !tokens.find((t) => t.address === token.address)) {
      form.setValue("token", tokens[0]?.address || "");
      yeetState.setToken(tokens[0]?.address || "");

      toast({
        title: "Token Not Available",
        description: "The selected token is not available on this network.",
        variant: "destructive",
      });

      if (openYeetDialog) {
        setYeetDialogOpen(false);
      }
    }
  }, [network, tokens, token, form, yeetState, toast]);

  useEffect(() => {
    if (amountSplitType === "equal") {
      const totalAmount = form.getValues("amount");
      const recipientCount = recipients.length;
      const amountPerRecipient = totalAmount / recipientCount;

      recipients.forEach((_, index) => {
        form.setValue(`recipients.${index}.amount`, amountPerRecipient);
      });
    }

    // if (amountSplitType === "custom") {
    //   const totalRecipientAmount = recipientValues.reduce(
    //     (acc, recipient) => acc + recipient.amount,
    //     0
    //   );

    //   form.setValue("amount", totalRecipientAmount);
    // }
  }, [form, recipients, amountSplitType]);

  return (
    <StepWrapper className="relative flex flex-col">
      <RedirectToSummaryIfCompleted />
      {/* { <StepHeader slide={slideDefinitions[0]} />} */}
      <div className="flex flex-col w-full gap-2 items-center mt-4">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="flex-1 w-full max-w-sm">
              {/* <FormLabel>Token</FormLabel> */}
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value as `0x${string}`);
                  yeetState.setToken(value as `0x${string}`);
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
              <FormMessage className="text-xs h-4" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex-1 w-full max-w-sm">
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
                  yeetState.setAmount(Number(value));
                }}
                placeholder="Yeet Amount"
                endContent={
                  <div className="h-full pr-5 flex items-center gap-2">
                    <Separator orientation="vertical" />
                    <span className="text-muted-foreground">{token?.code}</span>
                  </div>
                }
              />
              <FormMessage className="text-xs h-4" />
            </FormItem>
          )}
        />
      </div>
      <div className="inline-flex items-center justify-center gap-2 my-3 w-full">
        <Button
          type="button"
          onClick={() => document.getElementById("csvUpload")?.click()}
          className="gap-2"
          disabled={isCSVUploading}
          variant={"outline"}
        >
          <RiUploadCloud2Line className="w-4 h-4" />
          {isCSVUploading ? "Uploading..." : "Upload CSV"}
        </Button>
        <Button
          type="button"
          onClick={() => yeetState.setAmountSplitType("equal")}
          className={cn(
            "gap-2",
            amountSplitType === "equal" ? "bg-primary" : ""
          )}
          variant={amountSplitType === "equal" ? "default" : "outline"}
        >
          <RiAddFill className="w-4 h-4" />
          Split Evenly
        </Button>
        <Button
          type="button"
          onClick={() => append({ address: "", amount: 0 })}
          className="gap-2"
          variant={"outline"}
        >
          <RiAddFill className="w-4 h-4" />
          Add Wallet
        </Button>
      </div>
      <Button onClick={handleYeet} className="gap-2 w-full">
        Ready To Yeet <RiSendPlaneFill className="w-4 h-4" />
      </Button>
      <YeetDialog
        onOpenChange={(open) => setYeetDialogOpen(open)}
        open={openYeetDialog}
        setOpen={setYeetDialogOpen}
      />
      <input {...getInputProps()} id="csvUpload" />
      <div className="flex flex-col overflow-y-scroll flex-1 h-full gap-2 mb-2">
        {recipients.map((field, index) => (
          <FormItem className={cn("", index === 0 && "mt-6")}>
            <FormLabel>{`Recipient ${index + 1}`}</FormLabel>
            <div className="flex gap-2">
              <FormField
                key={field.id}
                control={form.control}
                name={`recipients.${index}.address`}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => {
                  return (
                    <FormControl>
                      <Input
                        startIcon={RiWalletLine}
                        endIcon={RiClipboardLine}
                        onEndIconClick={() => handlePaste("address")(index)}
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
                control={form.control}
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
                        onEndIconClick={() => handlePaste("amount")(index)}
                        onChange={(e) => {
                          onChange(e);
                          yeetState.setAmountSplitType("custom");
                        }}
                        onBlur={onBlur}
                        value={value}
                        ref={ref}
                        inputMode="numeric"
                        step="0.000000000000000001"
                        // onChange={(e) => {
                        //   const value = e.target.value;
                        //   onChange(value);
                        //   yeetState.setAmount(Number(value));
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
    </StepWrapper>
  );
};

export default YeetLoadPage;
