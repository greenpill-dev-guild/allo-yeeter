import { createStore, useStore } from 'zustand';

const initialState = {
  addresses: [],
  poolId: BigInt(0),
  chainId: '0x',
  strategyAddress: '0x',
  amount: '0x',
};

interface FormStore {
  addresses: `0x${string}`[];
  poolId: bigint;
  chainId: `0x${string}`;
  strategyAddress: `0x${string}`;
  amount: string;
}

const createFormStore = (init = initialState) =>
  createStore<FormStore>(set => init);
