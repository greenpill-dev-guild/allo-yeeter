import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { YeetFormData } from '../hooks/useYeetForm';
// import Success from './5_Success';
import { Swiper } from 'swiper/react';
import Image from 'next/image';
import { RiCoinFill, RiFileListFill, RiGroupFill } from '@remixicon/react';

const ICON_SIZE = 32;

export interface SlideProps {
  form: UseFormReturn<YeetFormData>;
  toast: any;
  fieldsToValidate: (keyof YeetFormData)[];
}

export interface SlideDefinition {
  url: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  fieldsToValidate: (keyof YeetFormData)[];
  icon: JSX.Element;
}

export const slideDefinitions: SlideDefinition[] = [
  {
    url: '/steps/recipients',
    shortTitle: 'Recipients',
    title: 'Add your recipients',
    subtitle: 'Enter the addresses you want to yeet to',
    fieldsToValidate: ['addresses'],
    icon: <RiGroupFill size={ICON_SIZE} className="text-primary" />,
  },
  {
    url: '/steps/token',
    shortTitle: 'Token',
    title: 'Select your token',
    subtitle: 'Choose or add the token you want to yeet',
    fieldsToValidate: ['network', 'token', 'customToken'],
    icon: <RiCoinFill size={ICON_SIZE} className="text-primary" />,
  },
  {
    url: '/steps/amount',
    shortTitle: 'Amount',
    title: 'Define the amount',
    subtitle: 'Choose how much you want to send to your recipients',
    fieldsToValidate: ['amount'],
    icon: <RiCoinFill size={ICON_SIZE} className="text-primary" />,
  },
  {
    url: '/steps/summary',
    shortTitle: 'Summary',
    title: 'Yeet Summary',
    subtitle: 'Confirm yeet amount and recipients',
    fieldsToValidate: [],
    icon: <RiFileListFill size={ICON_SIZE} className="text-primary" />,
  },
];
