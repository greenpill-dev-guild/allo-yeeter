import React, { useState, useMemo, useCallback } from 'react';
import {
  Allo,
  CreatePoolArgs,
  StrategyFactory,
  TransactionData,
  YeeterStrategy,
  // createPoolWithCustomStrategy,
} from '@allo-team/allo-v2-sdk';
import {
  useAccount,
  useCall,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { parseEther } from 'viem';
import { SlideProps } from './slideDefinitions';
import { Button } from '@/components/ui/button';
import { useProfile } from '@allo-team/kit';

const sendConfig = {
  mutation: {
    onError: (error: Error) => {
      console.log('error', error);
    },
  },
};

const Confirm: React.FC<SlideProps> = ({
  form,
  swiper,
  toast,
  nextButtonText,
}) => {
  const {
    network: chainId,
    token,
    amount: totalAmount,
    addresses,
  } = form.getValues();
  const { address } = useAccount();
  const { sendTransaction: sendFactoryTransaction, data: hash } =
    useSendTransaction(sendConfig);
  const { sendTransaction: sendPoolTransaction, data: poolHash } =
    useSendTransaction(sendConfig);
  const { sendTransaction: sendYeet, data: yeetHash } =
    useSendTransaction(sendConfig);
  const { isLoading: isLoadingFactory, isSuccess: isSuccessFactory } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { isLoading: isLoadingPool, isSuccess: isSuccessPool } =
    useWaitForTransactionReceipt({
      hash: poolHash,
    });
  const { isLoading: isLoadingYeet, isSuccess: isSuccessYeet } =
    useWaitForTransactionReceipt({
      hash: yeetHash,
    });
  const [error, setError] = useState<string | null>(null);
  const [poolId, setPoolId] = useState<bigint>(BigInt(0));
  const { data: profileId } = useProfile();
  console.log({ profileId, chainId, address, token });

  const allo = useMemo(() => {
    if (!chainId) return null;
    return new Allo({ chain: parseInt(chainId) });
  }, [chainId]);

  const strategyFactory = useMemo(() => {
    if (!chainId) return null;
    return new StrategyFactory({
      chain: parseInt(chainId),
      factoryType: 'YTR',
    });
  }, [chainId]);

  const yeeter = useMemo(() => {
    if (!chainId || !poolId) return null;
    return new YeeterStrategy({
      chain: parseInt(chainId),
      // rpc: data.rpc,
      address: '0x3B7AD76762a6d6D652664F35696c57552b7411dD',
      // address: data.address,
      poolId,
    });
  }, [chainId, poolId]);

  const createYeeter = useCallback(async () => {
    if (!strategyFactory) return;
    const createYeeterTx = strategyFactory.getCreateStrategyData();
    await sendFactoryTransaction({
      data: createYeeterTx.data,
      to: createYeeterTx.to,
      value: BigInt(createYeeterTx.value),
    });
  }, [strategyFactory, sendFactoryTransaction]);

  const createPool = useCallback(async () => {
    console.log('Creating pool');
    if (!allo) return;
    const args: CreatePoolArgs = {
      profileId: profileId as `0x${string}`, // TODO: better err handling
      strategy: '0x3B7AD76762a6d6D652664F35696c57552b7411dD',
      initStrategyData: '0x',
      token: token as `0x${string}`,
      amount: BigInt(10000),
      metadata: {
        protocol: BigInt(1),
        pointer: 'Test',
      },
      managers: [address as `0x${string}`],
    };
    const poolTx: TransactionData = allo.createPoolWithCustomStrategy(args);
    const poolReceipt = await sendPoolTransaction({
      data: poolTx.data,
      to: poolTx.to,
      value: BigInt(poolTx.value),
      gas: BigInt(20_000_000),
      gasPrice: BigInt(1_000_000_000),
    });
    console.log('Pool created', poolTx, poolReceipt);
  }, [allo, sendPoolTransaction, profileId, address, token]);

  const yeet = useCallback(async () => {
    const amountPerAddress = Math.floor(
      parseInt(totalAmount) / addresses.length,
    );

    const dataForContract = {
      recipientIds: addresses.map(
        address => address.address,
      ) as `0x${string}`[],
      amounts: addresses.map(() => BigInt(amountPerAddress)) as bigint[],
      token: token as `0x${string}`,
    };
    if (!yeeter) return;
    const yeetTx = yeeter.getAllocateData(dataForContract);
    await sendYeet({
      data: yeetTx.data,
      to: yeetTx.to,
      value: BigInt(yeetTx.value),
      // gas: BigInt(20_000_000),
      // gasPrice: BigInt(1_000_000_000),
    });
  }, [yeeter, sendYeet, addresses, totalAmount, token]);

  React.useEffect(() => {
    if (isSuccessFactory || isSuccessPool || isSuccessYeet) {
      console.log('Transaction successful');
      swiper?.slideNext();
      toast({
        title: 'Transaction Successful',
        description: 'Your Yeet has been confirmed!',
        variant: 'success',
      });
    }
  }, [isSuccessFactory, isSuccessPool, isSuccessYeet, swiper, toast]);

  return (
    <div>
      <h2>Confirm Your Yeet</h2>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      <div className="flex flex-row gap-2">
        <Button onClick={createYeeter} disabled={isLoadingFactory}>
          {isLoadingFactory ? 'Processing...' : 'Create Yeeter'}
        </Button>
        <Button onClick={createPool} disabled={isLoadingPool}>
          {isLoadingPool ? 'Processing...' : 'Create Pool'}
        </Button>
        <Button onClick={yeet} disabled={isLoadingYeet}>
          {isLoadingYeet ? 'Processing...' : 'Yeet'}
        </Button>
      </div>
      {/* <Button onClick={handleConfirm} disabled={isLoading}>
        {isLoading ? 'Processing...' : nextButtonText}
      </Button> */}
      {isLoadingFactory && <p>Transaction is being processed...</p>}
      {isLoadingPool && <p>Transaction is being processed...</p>}
      {isLoadingYeet && <p>Transaction is being processed...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Confirm;
