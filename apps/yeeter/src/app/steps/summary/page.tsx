'use client';

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
import { Button } from '@/components/ui/button';
import { useAPI, useProfile } from '@allo-team/kit';
import { useYeetForm } from '@/hooks/useYeetForm';
import { useToast } from '@/hooks/use-toast';
import { slideDefinitions } from '@/app/slideDefinitions';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';
import {
  RiHandCoinFill,
  RiLoader4Line,
  RiMoneyCnyBoxFill,
  RiRocket2Fill,
  RiUploadCloud2Fill,
} from '@remixicon/react';

const sendConfig = {
  mutation: {
    onError: (error: Error) => {
      console.log('error', error);
    },
  },
};

const Confirm = () => {
  const form = useYeetForm();
  const { toast } = useToast();
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
      chain: chainId,
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
    return new Allo({ chain: chainId });
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
      amount: parseEther(totalAmount.toString()),
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
      // get last log
      const poolFunded = poolData?.logs?.[poolData.logs.length - 1];
      // get pool id from log topic
      const poolId = poolFunded?.topics?.[1];
      console.log({ token, poolData });
      if (poolId) {
        console.log('Pool created successfully', poolId);
        setPoolId(BigInt(poolId));
      }
    }
  }, [isSuccessPool, poolData]);
  // #endregion

  // #region yeet
  const yeeter = useMemo(() => {
    console.log({ chainId, poolId, strategyAddress });
    if (!chainId || !poolId) return null;
    // return;
    return new YeeterStrategy({
      chain: chainId,
      // chain: 11155111,
      rpc: 'https://rpc.sepolia.org',
      address: strategyAddress as `0x${string}`,
      // address: '0x03a3afa2a68ecda94cdcfb607b12c1c90d888745',
      poolId,
      // poolId: BigInt(532),
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

    const gwei = parseEther(totalAmount.toString());
    const onePercent = gwei / BigInt(100);
    const amountPerAddress = (gwei - onePercent) / BigInt(addresses.length);

    const dataForContract = {
      recipientIds: addresses.map(
        address => address.address,
      ) as `0x${string}`[],
      amounts: addresses.map(() => BigInt(amountPerAddress)) as bigint[],
      token: token as `0x${string}`,
    };
    // const dataForContract = {
    //   recipientIds: [
    //     '0x7849F6Ba978188Ce97bB02bDABa673Af65CBd269',
    //   ] as `0x${string}`[],
    //   amounts: [amountPerAddress] as bigint[],
    //   token: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    // };

    const yeetTx = yeeter.getAllocateData(dataForContract);

    console.log({ yeetTx, dataForContract });

    await sendYeet({
      data: yeetTx.data,
      to: yeetTx.to,
      // to: '0x1133eA7Af70876e64665ecD07C0A0476d09465a1',
      value: BigInt(yeetTx.value),
      // value: BigInt(900),
      // value: BigInt(0),
      // gas: BigInt(20_000_000),
      // gasPrice: BigInt(1_000_000_000),
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
      console.log('Yeeter strategy hash', factoryHash);
      toast({
        title: 'Yeeter contract created successfully',
        description: 'Your Yeet has been confirmed!',
        variant: 'default',
      });
    }
    if (isSuccessPool) {
      console.log('Pool hash', poolHash);
      toast({
        title: 'Pool created successfully',
        description: 'Your Yeet has been confirmed!',
        variant: 'default',
      });
    }
    if (isSuccessYeet) {
      console.log('Yeet hash', yeetHash);
      toast({
        title: 'Yeet successful',
        description: 'Your Yeet has been confirmed!',
        variant: 'default',
      });
    }
    if (isErrorYeet) {
      console.log('Yeet failed', yeetHash);
      toast({
        title: 'Yeet failed',
        description: 'Your Yeet has failed!',
        variant: 'destructive',
      });
    }
  }, [isSuccessFactory, isSuccessPool, isSuccessYeet, toast]);

  return (
    <>
      <StepWrapper>
        <StepHeader slide={slideDefinitions[3]} />
        <Separator className="my-4" label="SUBTOTAL" />
        <h2>Confirm Your Yeet</h2>
        <pre className="text-sm overflow-x-hidden">
          {JSON.stringify(
            {
              profileId,
              poolId: Number(poolId),
              strategyAddress,
              ...form.getValues(),
            },
            null,
            2,
          )}
        </pre>
        {error && <p className="text-red-500">{error}</p>}
      </StepWrapper>
      <div className="flex flex-row gap-2">
        <Button onClick={createYeeterContract} disabled={isLoadingFactory}>
          {isLoadingFactory ? (
            <RiLoader4Line className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RiUploadCloud2Fill className="h-4 w-4 mr-2" />
          )}
          {isLoadingFactory ? 'Processing...' : 'Deploy Yeeter'}
        </Button>
        <Button onClick={createPool} disabled={isLoadingPool}>
          {isLoadingPool ? (
            <RiLoader4Line className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RiHandCoinFill className="h-4 w-4 mr-2" />
          )}
          {isLoadingPool ? 'Processing...' : 'Create Pool'}
        </Button>
        <Button onClick={yeet} disabled={false}>
          {isLoadingYeet ? (
            <RiLoader4Line className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RiRocket2Fill className="h-4 w-4 mr-2" />
          )}
          {isLoadingYeet ? 'Processing...' : 'Yeet'}
        </Button>
      </div>
    </>
  );
};

export default Confirm;
