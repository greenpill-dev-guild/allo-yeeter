'use client';

import { useForm, UseFormReturn, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormStore } from '@/store/form';

const addressSchema = z
  .string()
  .min(2, 'Address must start with 0x')
  .max(42, 'Address cannot be longer than 42 characters')
  .regex(/^0x[a-fA-F0-9]*$/, 'Invalid Ethereum address format')
  .refine(
    value => value.length === 2 || value.length === 42,
    'Address must be 42 characters long when filled',
  );

const customTokenSchema = z.object({
  address: addressSchema,
  symbol: z.string().min(1, 'Symbol is required'),
  decimals: z.string().regex(/^\d+$/, 'Decimals must be a number'),
});

export const yeetFormSchema = z
  .object({
    addresses: z
      .array(z.object({ address: addressSchema }))
      .min(1, 'At least one address is required'),
    network: z.number().min(1, 'Network selection is required'),
    token: addressSchema.optional(),
    customToken: customTokenSchema.optional(),
    amount: z.coerce
      .number()
      .refine(val => val > 0, 'Amount must be greater than 0'),
  })
  .refine(data => data.token || data.customToken, {
    message: 'Either token or custom token must be provided',
    path: ['token'],
  });

export type YeetFormData = z.infer<typeof yeetFormSchema>;

export const useYeetForm = (): UseFormReturn<YeetFormData> => {
  const { addresses, amount, network, token } = useFormStore(state => state);
  const form = useForm<YeetFormData>({
    resolver: zodResolver(yeetFormSchema),
    defaultValues: {
      addresses: addresses.map(a => ({ address: a })),
      network,
      token,
      amount,
    },
    mode: 'all',
  });

  return form;
};

export const YeetFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useYeetForm();
  return <FormProvider {...form}> {children} </FormProvider>;
};
