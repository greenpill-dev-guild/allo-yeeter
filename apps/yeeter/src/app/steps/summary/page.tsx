'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Allo,
  CreatePoolArgs,
  StrategyFactory,
  TransactionData,
  YeeterStrategy,
} from '@allo-team/allo-v2-sdk';
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseEther } from 'viem';
import { useProfile } from '@allo-team/kit';
import { useYeetForm } from '@/hooks/useYeetForm';
import { useToast } from '@/hooks/use-toast';
import { useFormStore } from '@/store/form';
import StepWrapper from '@/components/step/StepWrapper';
import StepHeader from '@/components/step/StepHeader';
import { Separator } from '@/components/ui/separator';
import { slideDefinitions } from '@/app/slideDefinitions';
import { Button } from '@/components/ui/button';
import {
  RiArrowLeftLine,
  RiHandCoinFill,
  RiLoader4Line,
  RiRocket2Fill,
  RiUploadCloud2Fill,
} from '@remixicon/react';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import RecipientsList from '@/components/recipients/RecipientsList';
import { TokenIcon } from '@/components/ui/token-icon';
import SummaryDetails from '@/components/summary/SummaryDetails';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

const sendConfig = {
  mutation: {
    onError: (error: Error) => {
      console.log('error', error);
    },
  },
};

const Summary = () => {
  const form = useYeetForm();
  const { poolId, setPoolId, strategyAddress, setStrategyAddress } =
    useFormStore(s => s);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { network: chainId, amount: totalAmount, addresses } = form.getValues();
  const router = useRouter();

  const token = useSelectedToken();

  const { address } = useAccount();
  const { data: profileId } = useProfile();

  const [overlayStatus, setOverlayStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [overlayMessage, setOverlayMessage] = useState('');

  // Add overlayOpen state back
  const [overlayOpen, setOverlayOpen] = useState(false);

  // #region create yeeter contract
  const { sendTransaction: sendFactoryTransaction, data: factoryHash } =
    useSendTransaction(sendConfig);
  const {
    isLoading: isLoadingFactory,
    isFetching: isFetchingFactory,
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
    setOverlayOpen(true);
    setOverlayStatus('loading');
    setOverlayMessage('Deploying Yeeter contract...');
    try {
      const createYeeterTx = strategyFactory.getCreateStrategyData();
      await sendFactoryTransaction({
        data: createYeeterTx.data,
        to: createYeeterTx.to,
        value: BigInt(createYeeterTx.value),
      });
    } catch (error) {
      setOverlayStatus('error');
      setOverlayMessage('Failed to deploy Yeeter contract');
    }
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
    if (
      !allo ||
      !strategyAddress ||
      !profileId ||
      !address ||
      !token ||
      !totalAmount
    ) {
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

    setOverlayOpen(true);
    setOverlayStatus('loading');
    setOverlayMessage('Creating pool...');

    try {
      const args: CreatePoolArgs = {
        profileId: profileId as `0x${string}`,
        strategy: strategyAddress as `0x${string}`,
        initStrategyData: '0x',
        token: token.address as `0x${string}`,
        amount: parseEther(totalAmount.toString()),
        metadata: {
          protocol: BigInt(1),
          pointer: 'Test',
        },
        managers: [address as `0x${string}`],
      };
      const poolTx: TransactionData = allo.createPoolWithCustomStrategy(args);
      await sendPoolTransaction({
        data: poolTx.data,
        to: poolTx.to,
        value: BigInt(poolTx.value),
      });
    } catch (error) {
      setOverlayStatus('error');
      setOverlayMessage('Failed to create pool');
    }
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
    isFetching: isFetchingPool,
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
      if (poolId) {
        setPoolId(BigInt(poolId));
      }
    }
  }, [isSuccessPool, poolData]);
  // #endregion

  // #region yeet
  const yeeter = useMemo(() => {
    if (!chainId || !poolId) return null;
    return new YeeterStrategy({
      chain: chainId,
      rpc: 'https://rpc.sepolia.org',
      address: strategyAddress as `0x${string}`,
      poolId: BigInt(poolId),
    });
  }, [chainId, poolId, strategyAddress]);
  const { sendTransaction: sendYeet, data: yeetHash } =
    useSendTransaction(sendConfig);
  const yeet = useCallback(async () => {
    if (!yeeter) {
      throw new Error('No yeeter initialized');
    }

    setOverlayOpen(true);
    setOverlayStatus('loading');
    setOverlayMessage('Yeeting funds...');

    try {
      const gwei = parseEther(totalAmount.toString());
      const onePercent = gwei / BigInt(100);
      const amountPerAddress = (gwei - onePercent) / BigInt(addresses.length);

      const dataForContract = {
        recipientIds: addresses.map(
          address => address.address,
        ) as `0x${string}`[],
        amounts: addresses.map(() => BigInt(amountPerAddress)) as bigint[],
        token: token?.address as `0x${string}`,
      };

      const yeetTx = yeeter.getAllocateData(dataForContract);

      await sendYeet({
        data: yeetTx.data,
        to: yeetTx.to,
        value: BigInt(yeetTx.value),
      });
    } catch (error) {
      setOverlayStatus('error');
      setOverlayMessage('Failed to yeet funds');
    }
  }, [yeeter, sendYeet, addresses, totalAmount, token]);

  const {
    isLoading: isLoadingYeet,
    isFetching: isFetchingYeet,
    isSuccess: isSuccessYeet,
    isError: isErrorYeet,
    data: yeetData,
  } = useWaitForTransactionReceipt({
    hash: yeetHash,
  });
  // #endregion

  // Update status and message based on transaction states
  useEffect(() => {
    if (isFetchingFactory) {
      setOverlayStatus('loading');
      setOverlayMessage('Deploying Yeeter contract...');
    } else if (isFetchingPool) {
      setOverlayStatus('loading');
      setOverlayMessage('Creating pool...');
    } else if (isFetchingYeet) {
      setOverlayStatus('loading');
      setOverlayMessage('Yeeting funds...');
    } else if (isSuccessFactory) {
      setOverlayStatus('success');
      setOverlayMessage('Yeeter contract deployed successfully!');
    } else if (isSuccessPool) {
      setOverlayStatus('success');
      setOverlayMessage('Pool created successfully!');
    } else if (isSuccessYeet) {
      setOverlayStatus('success');
      setOverlayMessage('Yeet completed successfully!');
    } else if (isErrorYeet) {
      setOverlayStatus('error');
      setOverlayMessage('Yeet failed!');
    }
  }, [
    isFetchingFactory,
    isFetchingPool,
    isFetchingYeet,
    isSuccessFactory,
    isSuccessPool,
    isSuccessYeet,
    isErrorYeet,
  ]);

  return (
    <>
      <StepWrapper>
        <StepHeader slide={slideDefinitions[3]} />
        <Separator className="my-8" label="SUBTOTAL" />
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-semibold">
            {`${Number(totalAmount).toLocaleString()} ${token?.code}`}
          </h2>
          {/* @ts-ignore yes I know it might be undefined */}
          <TokenIcon icon={token?.icon} className="w-14 h-14" />
        </div>
        <SummaryDetails />
        <Separator label="RECIPIENTS" className="my-8" />
        <div className="w-full">
          <RecipientsList />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </StepWrapper>
      <LoadingOverlay
        isOpen={overlayOpen}
        onClose={() => {
          setOverlayOpen(false);
          setOverlayStatus('loading');
          setOverlayMessage('');
        }}
        status={overlayStatus}
        message={overlayMessage}
      />
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => router.back()}
          className="gap-2"
          variant={'ghost'}
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back
        </Button>
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

export default Summary;
