import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@allo-team/kit/styles.css';
import './globals.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

import { Header } from './header';
import { AlloKitProviders } from './providers';
import Footer from './footer';
import { FormStoreProvider } from '@/store/form';
import { YeetFormProvider } from '@/hooks/useYeetForm';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Allo Starter Kit Yeeter App',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'dark')}>
        <AlloKitProviders>
          <FormStoreProvider>
            <YeetFormProvider>
              <div className="flex flex-col gap-12 justify-between w-full bg-[url('/GridPatternBG.svg')] h-screen bg-center bg-no-repeat bg-contain">
                <Header />
                <main className="max-w-screen-sm w-full mx-auto overflow-hidden flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </YeetFormProvider>
          </FormStoreProvider>
        </AlloKitProviders>
      </body>
    </html>
  );
}
