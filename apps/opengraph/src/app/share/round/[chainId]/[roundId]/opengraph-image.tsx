import { ImageResponse } from "next/og";
import { QRCodeSVG } from "qrcode.react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { formatNumber, indexer } from "@allo-team/kit";
import { format } from "date-fns";
import { getChains } from "@gitcoin/gitcoin-chain-data";
import { formatUnits, getAddress } from "viem";

const title = "Gitcoin";
export const alt = title;
export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function Image(props: {
  params: { roundId: string; chainId: string };
}) {
  try {
    const { roundId, chainId } = props.params;
    const host = headers().get("host");

    const roundUrl = `https://${host}/share/round/${chainId}/${roundId}`;

    const round = await indexer.roundById(roundId, {
      chainId,
    });

    if (!round) return notFound();
    const applications = await indexer.applications({
      where: { roundId: { equalTo: roundId } },
      orderBy: { total_amount_donated_in_usd: "desc" },
      first: 12,
    });

    const { applicationsStartTime, donationsEndTime } = round.phases ?? {};
    const network = getChains()?.find((chain) => chain.id === Number(chainId));

    const token = network?.tokens.find(
      (t) => getAddress(t.address) === getAddress(round.matching.token)
    );
    return new ImageResponse(
      (
        <div tw="bg-white w-full h-full flex flex-col justify-center items-center">
          <div tw="flex absolute bottom-3 right-4">
            <svg
              height={20}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1083.49 192.9"
            >
              <g>
                <path d="m333.9,189.69V45.69h-40.75V3.46h127.2v42.24h-40.75v144h-45.69Z" />
                <path d="m0,97.32C0,39.52,44.21,0,100.03,0c33.59,0,63.97,13.58,83.48,42.73l-40.26,20.99c-10.87-14.82-24.95-22.72-42.73-22.72-31.37,0-53.35,24.45-53.35,56.56s23.96,56.07,51.87,56.07c22.97,0,39.52-13.83,42.48-32.11v-.25h-39.02v-35.07h90.15v7.9c0,60.76-36.31,98.8-94.1,98.8C43.96,192.9,0,153.63,0,97.32Z" />
                <path d="m223.99,189.69V3.46h45.69v186.23h-45.69Z" />
                <path d="m823.07,189.69V3.46h45.69v186.23h-45.69Z" />
                <path d="m1038.79,3.46h44.71v186.23h-37.05l-93.36-117.32.74,117.32h-44.95V3.46h38.04l93.36,116.58-1.48-116.58Z" />
                <path d="m531.05,150.67c-28.4,0-52.36-22.23-52.36-54.09,0-30.13,22.97-54.09,52.86-54.09,14.72,0,27.57,5.57,36.92,14.79,4.51-14.4,11.53-27.87,20.86-39.91C572.99,6.46,553.11.25,531.79.25c-54.83,0-100.28,41-100.28,96.08,0,57.8,45.69,96.57,99.54,96.57,21.5,0,41.53-6.02,57.96-16.72-9.22-12.03-16.17-25.58-20.62-40.16-9.49,9.18-22.53,14.65-37.34,14.65Z" />
                <path d="m694.83.25c-34.41,0-65.12,16.15-83.23,41.79-10.74,15.22-17.05,33.78-17.05,54.29s6.29,40.25,16.95,55.45c18.07,25.77,48.72,41.12,82.59,41.12,55.08,0,100.53-39.52,100.53-96.08S749.42.25,694.83.25Zm-.74,150.42c-28.4,0-52.36-22.23-52.36-54.09,0-30.13,22.97-54.09,52.86-54.09s52.86,23.71,52.86,54.34-22.97,53.84-53.35,53.84Z" />
              </g>
            </svg>
          </div>
          <div tw="flex flex-col items-center">
            <div tw="text-[56px] text-gray-900 text-center mb-2">
              {round.name}
            </div>
            <div tw="flex text-gray-800 tracking-widest gap-4 text mb-4">
              <div tw="flex">
                {applicationsStartTime && format(applicationsStartTime, "PP")} -{" "}
                {donationsEndTime && format(donationsEndTime, "PP")}
              </div>
              <div tw="mx-2">•</div>
              <div tw="flex">{network?.prettyName}</div>
              <div tw="mx-2">•</div>
              <div tw="flex">
                {token?.code}{" "}
                {formatNumber(
                  Number(formatUnits(round.matching.amount!, token?.decimals!))
                )}
              </div>
            </div>
            <div
              tw="flex text-lg mb-6 text-gray-900 max-w-[800px]"
              style={{ lineHeight: 1.3 }}
            >
              <span>{round.description?.slice(0, 270)}...</span>
            </div>
          </div>
          <div tw="flex mb-4">
            {(applications ?? []).map((a) => (
              <div key={a.id} tw="mx-.5 flex">
                {a.avatarUrl ? (
                  <img
                    src={a.avatarUrl}
                    tw="rounded-lg w-16 h-16 object-contain"
                  />
                ) : (
                  <div tw="flex w-16 h-16 bg-gray-800 rounded-lg" />
                )}
              </div>
            ))}
          </div>
          <div tw="flex bg-white p-2 rounded mb-2 border-2 border-gray-200">
            <QRCodeSVG size={200} value={roundUrl} />
          </div>
          <div tw="flex bg-gray-900 text-white w-[214px] p-2 rounded shadow-xl justify-center font-semibold  mb-4">
            Donate now
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error(error);

    return notFound();
  }
}
