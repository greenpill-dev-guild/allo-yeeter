"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

import { useYeetStore } from "@/store/yeet";
import { Form } from "@/components/ui/form";

const addressSchema = z
  .string()
  .min(2, "Address must start with 0x")
  .max(42, "Address cannot be longer than 42 characters")
  .regex(/^0x[a-fA-F0-9]*$/, "Invalid Ethereum address format")
  .refine(
    (value) => value.length === 2 || value.length === 42,
    "Address must be 42 characters long when filled"
  );

const recipient = z.object({
  address: addressSchema,
  amount: z.coerce
    .number()
    .refine((val) => val > 0, "Amount must be greater than 0"),
});

export const yeetFormSchema = z
  .object({
    token: addressSchema.optional(),
    amount: z.coerce
      .number()
      .refine((val) => val > 0, "Amount must be greater than 0"),
    recipients: z.array(recipient).min(1, "At least one recipient is required"),
  })
  .refine((data) => data.token, {
    message: "Token must be provided",
    path: ["token"],
  })
  .refine(
    (data) =>
      data.amount === data.recipients.reduce((acc, rec) => acc + rec.amount, 0),
    {
      message: "Total amount must match the sum of recipient amounts",
      path: ["amount"],
    }
  );

export type YeetFormData = z.infer<typeof yeetFormSchema>;

export const useYeetForm = (): UseFormReturn<YeetFormData> => {
  const { recipients, amount, token } = useYeetStore((state) => state);
  const form = useForm<YeetFormData>({
    resolver: zodResolver(yeetFormSchema),
    defaultValues: {
      recipients,
      token,
      amount,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return form;
};

export const YeetFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useYeetForm();

  return <Form {...form}>{children}</Form>;
};
