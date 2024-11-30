'use client';
import { useEffect, type PropsWithChildren } from 'react';
import { Button } from './ui/button';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import {
  RiWallet2Fill,
  RiWallet2Line,
  RiWallet3Fill,
  RiWalletFill,
} from '@remixicon/react';
import { useFormStore } from '@/store/form';
import { useRouter } from 'next/navigation';

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
        authenticationStatus,
      }) => {
        const connected = mounted && account && chain;
        console.log('connected', {
          connected,
          account,
          chain,
          mounted,
          authenticationStatus,
        });
        const resetYeetForm = useFormStore(state => state.resetYeetForm);
        const router = useRouter();
        // clear state on disconnect
        useEffect(() => {
          if (!account) {
            resetYeetForm();
            router.push('/');
          }
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
                  <Button onClick={openAccountModal}>
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
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
