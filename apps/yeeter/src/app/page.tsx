"use client";
import { supportedChains, Avatar } from "@allo-team/kit";
import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1 className="text-7xl pt-12 pb-24 font-semibold text-center">
        Allo Starter Kit
      </h1>

      <h3 className="text-2xl text-center mb-8 font-semibold">Browse Rounds</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {supportedChains.map((chain) => (
          <Link
            key={chain.id}
            href={`/${chain.id}`}
            className="flex gap-2 items-center hover:bg-gray-100 rounded-xl p-2"
          >
            <Avatar className="size-8">
              <span
                className="size-8"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: chain.icon comes as an SVG string
                dangerouslySetInnerHTML={{ __html: fixSvg(chain.icon) }}
              />
            </Avatar>
            <div className="text-lg capitalize">{chain.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function fixSvg(svg: string) {
  return svg.replace(/(width|height)="[^"]*"/g, '$1="100%"');
}
