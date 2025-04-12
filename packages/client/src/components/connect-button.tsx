'use client';
import { useContext, useEffect, useRef, type PropsWithChildren } from 'react';
import { Button } from './ui/button';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import {
  RiWallet2Fill,
  RiWallet2Line,
  RiWallet3Fill,
  RiWalletFill,
} from '@remixicon/react';
import { FormStoreContext, useFormStore } from '@/store/form';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function ConnectButton({ children }: PropsWithChildren) {
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
        console.log('connected', {
          connected,
          account,
          chain,
          mounted,
          authenticationStatus,
        });
        const resetYeetForm = useFormStore(state => state.resetYeetForm);
        const store = useContext(FormStoreContext);
        const router = useRouter();
        const { reset: resetForm } = useForm();
        // clear state on disconnect
        console.log({ account });
        useEffect(() => {
          if (!account && lastAccountIsActive.current) {
            resetForm();
            resetYeetForm();
            store?.persist?.clearStorage?.();
            router.push('/');
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
