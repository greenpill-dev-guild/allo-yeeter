"use client";
import { ConnectButton } from "@allo-team/kit";
import Link from "next/link";
export function Header() {
  return (
    <header className="h-16 max-w-screen-lg mx-auto flex items-center justify-between">
      <Link href="/">
        <span className="font-semibold mr-2">Allo Starter Kit</span>

        <span className="text-xs">yeeter</span>
      </Link>

      <nav className="flex gap-8">
        <Link href={"/admin/rounds"}>My Rounds</Link>
        <Link href={"/admin/rounds/create"}>Create Round</Link>
        <Link href={"/11155111/projects/create"}>Create Project</Link>
      </nav>

      <ConnectButton />
    </header>
  );
}
