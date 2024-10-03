"use client";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectButton({ children }: PropsWithChildren) {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal}>Connect Wallet</Button>
                );
              }

              if (chain.unsupported) {
                return <Button onClick={openChainModal}>Wrong network</Button>;
              }

              return (
                children || (
                  <Button onClick={openAccountModal}>
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                )
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
