"use client";

// import { useChainId } from "wagmi";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RiWalletFill } from "@remixicon/react";
import { useContext, useEffect, useRef, type PropsWithChildren } from "react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

import { YeetStoreContext, useYeetStore } from "@/store/yeet";

import { Button } from "./ui/button";

export function ConnectButton({ children }: PropsWithChildren) {
  // const chain = useChainId;
  const lastAccountIsActive = useRef(false);

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const connected = mounted && account && chain;
        console.log("connected", {
          connected,
          account,
          chain,
          mounted,
          authenticationStatus,
        });
        const resetYeetForm = useYeetStore((state) => state.resetYeetForm);
        const store = useContext(YeetStoreContext);
        const router = useRouter();
        const { reset: resetForm } = useForm();
        // clear state on disconnect
        console.log({ account });
        useEffect(() => {
          if (!account && lastAccountIsActive.current) {
            resetForm();
            resetYeetForm();
            store?.persist?.clearStorage?.();
            router.push("/");
            lastAccountIsActive.current = false;
          }
          lastAccountIsActive.current = !!account;
        }, [mounted, account, chain]);

        return (
          <div
          // {...(!mounted && {
          //   'aria-hidden': true,
          //   style: {
          //     opacity: 0,
          //     pointerEvents: 'none',
          //     userSelect: 'none',
          //   },
          // })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal}>
                    <RiWalletFill className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return <Button onClick={openChainModal}>Wrong network</Button>;
              }

              return (
                children || (
                  <div className="flex gap-2">
                    <Button onClick={openAccountModal}>
                      {account.displayName}
                      {/* {account.displayBalance ?
                        ` (${account.displayBalance})`
                      : ""} */}
                    </Button>
                    <Button onClick={openChainModal}>Change Network</Button>
                  </div>
                )
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
