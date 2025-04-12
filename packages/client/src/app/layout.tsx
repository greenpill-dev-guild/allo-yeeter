import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { FormStoreProvider } from "@/store/form";
import { YeetFormProvider } from "@/hooks/useYeetForm";
import { Toaster } from "@/components/ui/toaster";

import { Header } from "./header";
import Footer from "./footer";
import { AlloKitProviders } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Allo Yeeter",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className)}>
        <AlloKitProviders>
          <FormStoreProvider>
            <YeetFormProvider>
              <div className="flex flex-col gap-6 justify-between w-full bg-[url('/GridPatternBG.svg')] h-screen bg-center bg-no-repeat bg-contain px-4">
                <Toaster />
                <Header />
                <main className="max-w-screen-sm w-full mx-auto overflow-hidden flex-grow items-center justify-center flex flex-col">
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
