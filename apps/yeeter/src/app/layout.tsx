import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@allo-team/kit/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import { Header } from './header';
import { AlloKitProviders } from './providers';
import Footer from './footer';

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
          <div className="grid gap-12 w-full bg-[url('/GridPatternBG.svg')] bg-cover h-screen bg-center">
            <Header />
            <main className="max-w-screen-sm w-full mx-auto overflow-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </AlloKitProviders>
      </body>
    </html>
  );
}
