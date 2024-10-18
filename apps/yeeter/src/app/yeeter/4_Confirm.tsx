import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Allo,
  CreatePoolArgs,
  Registry,
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
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { parseEther } from 'viem';
import { SlideProps } from './slideDefinitions';
import { Button } from '@/components/ui/button';
import { useAPI, useProfile } from '@allo-team/kit';

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
  const { data: profileId } = useProfile();
  const [error, setError] = useState<string | null>(null);

  const [poolId, setPoolId] = useState<bigint>(BigInt(0));
  const [strategyAddress, setStrategyAddress] = useState<`0x${string}` | null>(
    null,
  );

  // #region create yeeter contract
  const { sendTransaction: sendFactoryTransaction, data: factoryHash } =
    useSendTransaction(sendConfig);
  const {
    isLoading: isLoadingFactory,
    isSuccess: isSuccessFactory,
    data: factoryData,
  } = useWaitForTransactionReceipt({
    hash: factoryHash,
  });
  useEffect(() => {
    if (isSuccessFactory) {
      let strategyAddress = factoryData?.logs?.[0]?.topics?.[2];
      if (strategyAddress) {
        strategyAddress = `0x${strategyAddress.slice(-40)}`;
        console.log('Strategy address', strategyAddress);
        setStrategyAddress(strategyAddress as `0x${string}`);
      }
    }
  }, [isSuccessFactory, factoryData]);
  const strategyFactory = useMemo(() => {
    if (!chainId) return null;
    return new StrategyFactory({
      chain: parseInt(chainId),
      factoryType: 'YTR',
    });
  }, [chainId]);
  const createYeeterContract = useCallback(async () => {
    if (!strategyFactory) return;
    const createYeeterTx = strategyFactory.getCreateStrategyData();
    await sendFactoryTransaction({
      data: createYeeterTx.data,
      to: createYeeterTx.to,
      value: BigInt(createYeeterTx.value),
    });
  }, [strategyFactory, sendFactoryTransaction]);
  // #endregion

  // #region create pool
  const allo = useMemo(() => {
    if (!chainId) return null;
    return new Allo({ chain: parseInt(chainId) });
  }, [chainId]);
  const { sendTransaction: sendPoolTransaction, data: poolHash } =
    useSendTransaction(sendConfig);
  const createPool = useCallback(async () => {
    console.log('Creating pool');
    if (
      !allo ||
      !strategyAddress ||
      !profileId ||
      !address ||
      !token ||
      !totalAmount
    ) {
      console.log('Missing required values');
      console.log({
        allo,
        strategyAddress,
        profileId,
        address,
        token,
        totalAmount,
      });
      return;
    }
    const args: CreatePoolArgs = {
      profileId: profileId as `0x${string}`, // TODO: better err handling
      // strategy: '0xB71E93404fDEF1044CBD79bBB4003F5Bf50402A9', // attempt 2
      // strategy: '0x3B7AD76762a6d6D652664F35696c57552b7411dD', // lawal's strategy
      // strategy: '0xCbe067eF97C062816F63E4fD26a440c4DE924410', // Julian's strategy pointing to allo proxy
      // strategy: '0x2FF25eda8B636Ec14bEE2Bc9ef55C96E2e77be11', // Julian's strategy pointing to allo proxy
      strategy: strategyAddress as `0x${string}`,
      initStrategyData: '0x',
      token: token as `0x${string}`,
      amount: parseEther(totalAmount),
      metadata: {
        protocol: BigInt(1),
        pointer: 'Test',
      },
      managers: [address as `0x${string}`],
    };
    console.log({ poolArgs: args });
    const poolTx: TransactionData = allo.createPoolWithCustomStrategy(args);
    console.log({ poolTx });
    const poolReceipt = await sendPoolTransaction({
      data: poolTx.data,
      to: poolTx.to,
      value: BigInt(poolTx.value),
      // gas: BigInt(20_000_000),
      // gasPrice: BigInt(1_000_000_000),
    });
    console.log('Creating pool', poolTx, poolReceipt);
  }, [
    allo,
    sendPoolTransaction,
    profileId,
    address,
    token,
    totalAmount,
    strategyAddress,
  ]);
  const {
    isLoading: isLoadingPool,
    isSuccess: isSuccessPool,
    data: poolData,
  } = useWaitForTransactionReceipt({
    hash: poolHash,
  });
  useEffect(() => {
    if (isSuccessPool) {
      const poolFunded = poolData?.logs?.[4];
      const poolId = poolFunded?.topics?.[1];
      if (poolId) {
        console.log('Pool created successfully', poolId);
        setPoolId(BigInt(poolId));
      }
    }
  }, [isSuccessPool, poolData]);
  // #endregion

  // #region yeet
  const yeeter = useMemo(() => {
    if (!chainId || !poolId) return null;
    return new YeeterStrategy({
      chain: parseInt(chainId),
      rpc: 'https://rpc.sepolia.org',
      address: strategyAddress as `0x${string}`,
      // address: '0x9c427fcb2cbe5819a909dc8d1cbc15f913ff235c',
      poolId,
    });
  }, [chainId, poolId, strategyAddress]);
  const { sendTransaction: sendYeet, data: yeetHash } =
    useSendTransaction(sendConfig);
  const yeet = useCallback(async () => {
    console.log('Yeeting');
    if (!yeeter) {
      console.log('No yeeter');
      return;
    }

    const gwei = parseEther(totalAmount);
    const onePercent = gwei / BigInt(100);
    const amountPerAddress = (gwei - onePercent) / BigInt(addresses.length);

    const dataForContract = {
      recipientIds: addresses.map(
        address => address.address,
      ) as `0x${string}`[],
      amounts: addresses.map(() => BigInt(amountPerAddress)) as bigint[],
      token: token as `0x${string}`,
    };

    const yeetTx = yeeter.getAllocateData(dataForContract);

    console.log({ yeetTx, dataForContract });

    await sendYeet({
      data: yeetTx.data,
      to: yeetTx.to,
      // to: '0x1133eA7Af70876e64665ecD07C0A0476d09465a1',
      // value: BigInt(900),
      value: BigInt(0),
      gas: BigInt(20_000_000),
      gasPrice: BigInt(1_000_000_000),
    });
  }, [yeeter, sendYeet, addresses, totalAmount, token]);

  const {
    isLoading: isLoadingYeet,
    isSuccess: isSuccessYeet,
    isError: isErrorYeet,
    data: yeetData,
  } = useWaitForTransactionReceipt({
    hash: yeetHash,
  });
  // #endregion

  React.useEffect(() => {
    if (isSuccessFactory) {
      console.log('Yeeter contract created successfully', factoryHash);
      toast({
        title: 'Yeeter contract created successfully',
        description: 'Your Yeet has been confirmed!',
        variant: 'success',
      });
    }
    if (isSuccessPool) {
      console.log('Pool created successfully', poolHash);
      toast({
        title: 'Pool created successfully',
        description: 'Your Yeet has been confirmed!',
        variant: 'success',
      });
    }
    if (isSuccessYeet) {
      console.log('Yeet successful', yeetHash);
      toast({
        title: 'Yeet successful',
        description: 'Your Yeet has been confirmed!',
        variant: 'success',
      });
      if (isErrorYeet) {
        console.log('Yeet failed', yeetHash);
        toast({
          title: 'Yeet failed',
          description: 'Your Yeet has failed!',
          variant: 'error',
        });
      }
    }
  }, [isSuccessFactory, isSuccessPool, isSuccessYeet, swiper, toast]);

  return (
    <div>
      <h2>Confirm Your Yeet</h2>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      <div className="flex flex-row gap-2">
        <Button onClick={createYeeterContract} disabled={isLoadingFactory}>
          {isLoadingFactory ? 'Processing...' : 'Create Yeeter'}
        </Button>
        <Button onClick={createPool} disabled={isLoadingPool}>
          {isLoadingPool ? 'Processing...' : 'Create Pool'}
        </Button>
        <Button onClick={yeet} disabled={false}>
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
