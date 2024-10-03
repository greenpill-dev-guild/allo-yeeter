"use client";

import { ConnectButton } from "@allo-team/kit";
import Link from "next/link";

export function Header() {
  return (
    <header className="max-w-screen-md mx-auto  p-2 flex justify-between items-center">
      <Link href="/">
        <div className="size-6 bg-gray-950 rounded-full hover:bg-white border-4 cursor-pointer border-gray-950 transition-colors" />
      </Link>
      <ConnectButton />
    </header>
  );
}
