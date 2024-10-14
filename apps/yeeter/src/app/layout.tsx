import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@allo-team/kit/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import { Header } from './header';
import { AlloKitProviders } from './providers';

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
      <body className={inter.className}>
        <AlloKitProviders>
          <div className="h-screen flex flex-col w-full">
            <Header />
            <main className="max-w-screen-lg mx-auto flex-grow -mt-16">
              {children}
            </main>
          </div>
        </AlloKitProviders>
      </body>
    </html>
  );
}
