import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from './useLocalStorageForm';
import Addresses from './1_Addresses';
import Settings from './2_Settings';
import Amount from './3_Amount';
import Confirm from './4_Confirm';
// import Success from './5_Success';
import { Swiper } from 'swiper/react';
import Image from 'next/image';
import { RiCoinFill, RiFileListFill, RiGroupFill } from '@remixicon/react';

export interface SlideProps {
  form: UseFormReturn<YeetFormData>;
  swiper: typeof Swiper | null;
  toast: any;
  fieldsToValidate: (keyof YeetFormData)[];
  nextButtonText: string;
}

export interface SlideDefinition {
  shortTitle: string;
  title: string;
  subtitle: string;
  component: React.ComponentType<SlideProps>;
  nextButtonText: string;
  fieldsToValidate: (keyof YeetFormData)[];
  icon: JSX.Element;
}

export const slideDefinitions: SlideDefinition[] = [
  {
    shortTitle: 'Recipients',
    title: 'Add your recipients',
    subtitle: 'Enter the addresses you want to yeet to',
    component: Addresses,
    nextButtonText: 'Next',
    fieldsToValidate: ['addresses'],
    icon: <RiGroupFill />,
  },
  {
    shortTitle: 'Token',
    title: 'Select your token',
    subtitle: 'Choose or add the token you want to yeet',
    component: Settings,
    nextButtonText: 'Next',
    fieldsToValidate: ['network', 'token', 'customToken'],
    icon: <RiCoinFill />,
  },
  {
    shortTitle: 'Amount',
    title: 'Define the amount',
    subtitle: 'Choose how much you want to send to your recipients',
    component: Amount,
    nextButtonText: 'Next',
    fieldsToValidate: ['amount'],
    icon: <RiCoinFill />,
  },
  {
    shortTitle: 'Summary',
    title: 'Yeet Summary',
    subtitle: 'Confirm yeet amount and recipients',
    component: Confirm,
    nextButtonText: 'Confirm Yeet',
    fieldsToValidate: [],
    icon: <RiFileListFill />,
  },
  // {
  //   title: 'Yeet Successful!',
  //   component: Success,
  //   nextButtonText: 'Back to Home',
  //   fieldsToValidate: [],
  // },
];
