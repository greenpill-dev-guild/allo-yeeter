import type { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';
import CreateProfileButton from '@/components/create-profile-button';

export const metadata: Metadata = {
  title: 'Allo Yeeter',
  description: '',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <CreateProfileButton>
      <div className="flex gap-4 w-full h-full flex-col items-stretch">
        {children}
      </div>
    </CreateProfileButton>
  );
}
