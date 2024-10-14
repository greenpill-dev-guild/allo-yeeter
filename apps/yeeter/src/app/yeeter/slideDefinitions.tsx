import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import Addresses from './1_Addresses';
import Settings from './2_Settings';
import Amount from './3_Amount';
import Confirm from './4_Confirm';
import Success from './5_Success';

export interface SlideDefinition {
  title: string;
  component: React.ComponentType<{ form: UseFormReturn<YeetFormData> }>;
  nextButtonText: string;
  fieldsToValidate: (keyof YeetFormData)[];
  onNext?: (form: UseFormReturn<YeetFormData>) => void;
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
    onNext: form => {
      const data = form.getValues();
      console.log('Form submitted:', data);
      // Here you would typically send the data to your backend
    },
  },
  {
    title: 'Yeet Successful!',
    component: Success,
    nextButtonText: 'Back to Home',
    fieldsToValidate: [],
    onNext: () => {
      console.log('Back to home');
      // Here you would typically navigate back to the home page
    },
  },
];
