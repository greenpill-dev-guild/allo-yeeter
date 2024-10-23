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
    <header className="h-16 max-w-screen-lg mx-auto flex items-center justify-between w-full">
      <Link href="/" className="h-full block w-60 relative">
        <Image
          src="/YeeterLogo.svg"
          alt="Yeeter Logo"
          className="object-contain object-left py-2"
          fill
          priority
        />
      </Link>
      <StepBreadcrumb currentUrl={pathname} />
      <ConnectButton />
    </header>
  );
}
