'use client';

import { createStore, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReactNode, createContext, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';

const initialState = {
  poolId: '',
  amount: 0,
  strategyAddress: '',
  yeetTx: '',
  addresses: ['', ''],
  network: 111_55_111,
  token: undefined,
  customToken: undefined,
  yeetStatus: 'pending' as 'pending' | 'completed',
};

export const RedirectToSummaryIfCompleted = () => {
  const formState = useFormStore(state => state);
  const router = useRouter();
  if (formState.yeetStatus === 'completed') {
    router.push('/steps/summary');
  }
  return null;
};

interface FormState {
  poolId: string;
  amount: number;
  strategyAddress: string;
  addresses: string[];
  network: number;
  token: `0x${string}` | undefined;
  customToken?: {
    address?: string;
    code?: string;
    decimals?: number;
    canVote?: boolean;
  };
  yeetTx: string;
  yeetStatus: 'pending' | 'completed';
  setYeetStatus: (yeetStatus: 'pending' | 'completed') => void;
  setYeetTx: (yeetTx: string) => void;
  setAddresses: (addresses: `0x${string}`[]) => void;
  setAmount: (amount: number) => void;
  setStrategyAddress: (strategyAddress: `0x${string}`) => void;
  setNetwork: (network: number) => void;
  setToken: (token: `0x${string}`) => void;
  setCustomToken: (customToken?: {
    address: `0x${string}`;
    code: string;
    decimals: string;
  }) => void;
  setPoolId: (poolId: bigint) => void;
  resetYeetForm: () => void;
}

let store: FormStoreApi | undefined;

const createFormStore = (init = initialState) =>
  createStore<FormState>()(
    persist(
      set => ({
        ...init,
        setYeetStatus: (yeetStatus: 'pending' | 'completed') => {
          set({ yeetStatus });
        },
        setYeetTx: (yeetTx: string) => {
          set({ yeetTx });
        },
        resetYeetForm: () => {
          set(initialState);
        },
        setAddresses: (addresses: `0x${string}`[]) => {
          set({ addresses });
        },
        setAmount: (amount: number) => {
          set({ amount });
        },
        setStrategyAddress: (strategyAddress: `0x${string}`) => {
          set({ strategyAddress });
        },
        setNetwork: (network: number) => {
          set({ network });
        },
        setToken: (token: `0x${string}`) => {
          set({ token });
        },
        setPoolId: (poolId: bigint) => {
          set({ poolId: poolId.toString() });
        },
        setCustomToken: customToken => {
          set({
            customToken: customToken
              ? {
                  ...customToken,
                  decimals: parseInt(customToken.decimals),
                  canVote: false,
                }
              : undefined,
          });
        },
      }),
      {
        name: 'yeeter-form',
      },
    ),
  );

type FormStoreApi = ReturnType<typeof createFormStore>;

export const FormStoreContext = createContext<FormStoreApi | undefined>(
  undefined,
);

export interface FormStoreProviderProps {
  children: ReactNode;
}

export const FormStoreProvider = ({ children }: FormStoreProviderProps) => {
  if (!store) {
    store = createFormStore();
  }

  return (
    <FormStoreContext.Provider value={store}>
      {children}
    </FormStoreContext.Provider>
  );
};

export const useFormStore = <T,>(selector: (state: FormState) => T): T => {
  const formStoreContext = useContext(FormStoreContext);

  if (!formStoreContext) {
    throw new Error(`useFormStore must be used within FormStoreProvider`);
  }

  return useStore(formStoreContext, selector);
};

export { createFormStore };
