import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { YeetStoreProvider } from "@/store/yeet";
import { YeetFormProvider } from "@/hooks/useYeetForm";

import { Toaster } from "@/components/ui/toaster";

import { AlloKitProviders } from "./providers";
import Footer from "./footer";
import { Header } from "./header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Allo Yeeter",
  description: "Create pools of fund you can quickly send.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "overflow-hidden")}>
        <AlloKitProviders>
          <YeetStoreProvider>
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
          </YeetStoreProvider>
        </AlloKitProviders>
      </body>
    </html>
  );
}
