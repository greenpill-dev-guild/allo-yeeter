'use client';

import { ConnectButton } from '@allo-team/kit';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { slideDefinitions } from './slideDefinitions';

import StepBreadcrumb from '@/components/form/step-breadcrumb';
import { usePathname, useRouter } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="max-w-screen-lg mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-full flex justify-between items-center sm:w-auto">
          <Link href="/" className="h-16 block w-60 relative">
            <Image
              src="/YeeterLogo.svg"
              alt="Yeeter Logo"
              className="object-contain object-left py-2"
              fill
              priority
            />
          </Link>
          <div className="sm:hidden">
            <ConnectButton />
          </div>
        </div>
        <div className="w-full sm:flex-1 my-4 sm:my-0 sm:mx-4">
          <StepBreadcrumb currentUrl={pathname} />
        </div>
        <div className="hidden sm:block">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
