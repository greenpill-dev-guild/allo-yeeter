import type { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';
import CreateProfileButton from '@/components/create-profile-button';

export const metadata: Metadata = {
  title: 'Allo Starter Kit Yeeter App',
  description: '',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return <CreateProfileButton>{children}</CreateProfileButton>;
}
