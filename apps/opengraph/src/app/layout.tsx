import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@allo-team/kit/styles.css";
import "./globals.css";
import { AlloKitProviders } from "./providers";
import { Header } from "./header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Allo App",
  description: "...",
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
          <Header />
          <main className="max-w-screen-md mx-auto p-2">
            {children}

            <footer className="py-24"></footer>
          </main>
        </AlloKitProviders>
      </body>
    </html>
  );
}
