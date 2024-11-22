import React, { PropsWithChildren } from 'react';
import CreateProfileButton from '@/components/create-profile-button';

export default function StepsLayout({ children }: PropsWithChildren) {
  return (
    <CreateProfileButton>
      <div className="flex gap-4 w-full h-full flex-col items-stretch">
        {children}
      </div>
    </CreateProfileButton>
  );
}
