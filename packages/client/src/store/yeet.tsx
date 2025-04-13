"use client";

import { useRouter } from "next/navigation";
import { persist } from "zustand/middleware";
import { createStore, useStore } from "zustand";
import { ReactNode, createContext, useContext } from "react";

interface Recipient {
  address: string;
  amount: number;
}

interface InitialState {
  network: number;
  token?: `0x${string}`;
  amount: number;
  amountSplitType: "equal" | "custom";
  recipients: Recipient[];
  strategyAddress: string;
  poolId: string;
  yeetTx: string;
  yeetStatus: "pending" | "completed";
}

interface YeetState extends InitialState {
  setNetwork: (network: number) => void;
  setToken: (token: `0x${string}`) => void;
  setAmount: (amount: number) => void;
  setAmountSplitType: (amountSplitType: "equal" | "custom") => void;
  setRecipients: (recipients: Recipient[]) => void;
  setStrategyAddress: (strategyAddress: `0x${string}`) => void;
  setPoolId: (poolId: bigint) => void;
  setYeetTx: (yeetTx: string) => void;
  setYeetStatus: (yeetStatus: "pending" | "completed") => void;
  resetYeetForm: () => void;
}

const initialState: InitialState = {
  network: 111_55_111,
  token: undefined,
  amount: 0,
  amountSplitType: "equal",
  recipients: [
    {
      address: "",
      amount: 0,
    },
    { address: "", amount: 0 },
  ],
  strategyAddress: "",
  poolId: "",
  yeetTx: "",
  yeetStatus: "pending" as "pending" | "completed",
};

export const RedirectToSummaryIfCompleted = () => {
  const formState = useYeetStore((state) => state);
  const router = useRouter();

  if (formState.yeetStatus === "completed") {
    router.push("/yeet/send");
  }
  return null;
};

const createYeetStore = (init = initialState) =>
  createStore<YeetState>()(
    persist(
      (set) => ({
        ...init,
        setNetwork: (network: number) => {
          set({ network });
        },
        setToken: (token: `0x${string}`) => {
          set({ token });
        },
        setAmount: (amount: number) => {
          set({ amount });
        },
        setAmountSplitType: (amountSplitType: "equal" | "custom") => {
          set({ amountSplitType });
        },
        setRecipients: (recipients: Recipient[]) => {
          set({ recipients });
        },
        setStrategyAddress: (strategyAddress: `0x${string}`) => {
          set({ strategyAddress });
        },
        setPoolId: (poolId: bigint) => {
          set({ poolId: poolId.toString() });
        },
        setYeetTx: (yeetTx: string) => {
          set({ yeetTx });
        },
        setYeetStatus: (yeetStatus: "pending" | "completed") => {
          set({ yeetStatus });
        },
        resetYeetForm: () => {
          set(initialState);
        },
      }),
      {
        name: "yeeter-form",
      }
    )
  );

let store: YeetStoreApi | undefined;

type YeetStoreApi = ReturnType<typeof createYeetStore>;

export const YeetStoreContext = createContext<YeetStoreApi | undefined>(
  undefined
);

export interface YeetStoreProviderProps {
  children: ReactNode;
}

export const YeetStoreProvider = ({ children }: YeetStoreProviderProps) => {
  if (!store) {
    store = createYeetStore();
  }

  return (
    <YeetStoreContext.Provider value={store}>
      {children}
    </YeetStoreContext.Provider>
  );
};

export const useYeetStore = <T,>(selector: (state: YeetState) => T): T => {
  const formStoreContext = useContext(YeetStoreContext);

  if (!formStoreContext) {
    throw new Error(`useYeetStore must be used within YeetStoreProvider`);
  }

  return useStore(formStoreContext, selector);
};

export { createYeetStore };
