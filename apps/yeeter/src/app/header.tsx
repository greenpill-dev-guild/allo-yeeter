import Image from 'next/image';
import Link from 'next/link';

import StepBreadcrumb from '@/components/form/step-breadcrumb';
import { ConnectButton } from '@/components/connect-button';

export function Header() {
  return (
    <header className="max-w-screen-lg mx-auto w-full">
      <div className="flex flex-col min-[940px]:flex-row items-center">
        <div className="w-full flex justify-between items-center min-[940px]:w-auto">
          <Link href="/" className="h-16 block w-60 relative">
            <Image
              src="/YeeterLogo.svg"
              alt="Yeeter Logo"
              className="object-contain object-left py-2"
              fill
              priority
            />
          </Link>
          <div className="min-[940px]:hidden">
            <ConnectButton />
          </div>
        </div>
        <div className="w-full min-[940px]:flex-1 my-4 min-[940px]:my-0 min-[940px]:mx-4">
          <StepBreadcrumb />
        </div>
        <div className="hidden min-[940px]:block">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
