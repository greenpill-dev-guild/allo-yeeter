import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const addressSchema = z.string()
  .min(2, 'Address must start with 0x')
  .max(42, 'Address cannot be longer than 42 characters')
  .regex(/^0x[a-fA-F0-9]*$/, 'Invalid Ethereum address format')
  .refine(
    (value) => value.length === 2 || value.length === 42,
    'Address must be 42 characters long when filled'
  );

const customTokenSchema = z.object({
  address: addressSchema,
  symbol: z.string().min(1, 'Symbol is required'),
  decimals: z.string().regex(/^\d+$/, 'Decimals must be a number'),
});

export const yeetFormSchema = z.object({
  addresses: z.array(z.object({ address: addressSchema }))
    .min(1, 'At least one address is required'),
  network: z.string().min(1, 'Network selection is required'),
  token: addressSchema.optional(),
  customToken: customTokenSchema.optional(),
  amount: z.string().refine(val => parseFloat(val) > 0, 'Amount must be greater than 0'),
}).refine(data => data.token || data.customToken, {
  message: "Either token or custom token must be provided",
  path: ["token"],
});

export type YeetFormData = z.infer<typeof yeetFormSchema>;

const STORAGE_KEY = 'yeetFormData';

export const useLocalStorageForm = (): UseFormReturn<YeetFormData> => {
  const form = useForm<YeetFormData>({
    resolver: zodResolver(yeetFormSchema),
    defaultValues: {
      addresses: [{ address: '' }],
      network: '',
      token: '',
      amount: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return form;
};
