'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ConnectButton } from '@allo-team/kit';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { slideDefinitions } from './slideDefinitions';

const Step = ({ number, text }: { number: number; text: string }) => (
  <BreadcrumbItem className="flex items-center gap-2">
    <div className="rounded-full bg-gray-200 w-6 h-6 text-center">
      {number}.
    </div>{' '}
    {text}
  </BreadcrumbItem>
);

export function Header() {
  return (
    <header className="h-16 max-w-screen-lg mx-auto flex items-center justify-between w-full">
      <Link href="/" className="h-full block w-60 relative">
        <Image
          src="/YeeterLogo.svg"
          alt="Yeeter Logo"
          className="object-contain object-left"
          fill
        />
      </Link>

      <Breadcrumb>
        <BreadcrumbList>
          {slideDefinitions.map((slide, index) => (
            <Fragment key={slide.title}>
              <Step number={index + 1} text={slide.title} />
              <BreadcrumbSeparator />
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <ConnectButton />
    </header>
  );
}
