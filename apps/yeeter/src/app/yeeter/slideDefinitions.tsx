import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import Addresses from './1_Addresses';
import Settings from './2_Settings';
import Amount from './3_Amount';
import Confirm from './4_Confirm';
import Success from './5_Success';
import { Swiper } from 'swiper/react';

export interface SlideProps {
  form: UseFormReturn<YeetFormData>;
  swiper: typeof Swiper | null;
  toast: any;
  fieldsToValidate: (keyof YeetFormData)[];
  nextButtonText: string;
}

export interface SlideDefinition {
  title: string;
  component: React.ComponentType<SlideProps>;
  nextButtonText: string;
  fieldsToValidate: (keyof YeetFormData)[];
}

export const slideDefinitions: SlideDefinition[] = [
  {
    title: 'Addresses',
    component: Addresses,
    nextButtonText: 'Next',
    fieldsToValidate: ['addresses'],
  },
  {
    title: 'Settings',
    component: Settings,
    nextButtonText: 'Next',
    fieldsToValidate: ['network', 'token', 'customToken'],
  },
  {
    title: 'Amount',
    component: Amount,
    nextButtonText: 'Next',
    fieldsToValidate: ['amount'],
  },
  {
    title: 'Confirm Your Yeet',
    component: Confirm,
    nextButtonText: 'Confirm Yeet',
    fieldsToValidate: [],
  },
  {
    title: 'Yeet Successful!',
    component: Success,
    nextButtonText: 'Back to Home',
    fieldsToValidate: [],
  },
];
