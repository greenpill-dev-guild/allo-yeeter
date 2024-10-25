'use client';

import { createStore, useStore } from 'zustand';
import { ReactNode, createContext, useRef, useContext } from 'react';

const initialState = {
  poolId: BigInt(0),
  amount: 0,
  strategyAddress: '',
  addresses: ['', ''],
  network: 111_55_111,
  token: '',
  customToken: {
    address: '',
    symbol: '',
    decimals: 0,
  },
};

interface FormState {
  poolId: bigint;
  amount: number;
  strategyAddress: string;
  addresses: string[];
  network: number;
  token: string;
  customToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  setAddresses: (addresses: `0x${string}`[]) => void;
  setAmount: (amount: number) => void;
  setStrategyAddress: (strategyAddress: `0x${string}`) => void;
  setNetwork: (network: number) => void;
  setToken: (token: `0x${string}`) => void;
  setCustomToken: (customToken: {
    address: `0x${string}`;
    symbol: string;
    decimals: number;
  }) => void;
  setPoolId: (poolId: bigint) => void;
}

const createFormStore = (init = initialState) =>
  createStore<FormState>(set => ({
    ...init,
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
      set({ poolId });
    },
    setCustomToken: (customToken: {
      address: `0x${string}`;
      symbol: string;
      decimals: number;
    }) => {
      set({ customToken });
    },
  }));

type FormStoreApi = ReturnType<typeof createFormStore>;

const FormStoreContext = createContext<FormStoreApi | undefined>(undefined);

export interface FormStoreProviderProps {
  children: ReactNode;
}

export const FormStoreProvider = ({ children }: FormStoreProviderProps) => {
  const storeRef = useRef<FormStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createFormStore();
  }

  return (
    <FormStoreContext.Provider value={storeRef.current}>
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
