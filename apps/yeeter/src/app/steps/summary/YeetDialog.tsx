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
import { useFormStore } from '@/store/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  RiLoader4Line,
  RiCheckLine,
  RiCloseLine,
  RiSendPlaneFill,
  RiFileCheckFill,
  RiHandCoinFill,
} from '@remixicon/react';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { cn } from '@/lib/utils';

const sendConfig = {
  mutation: {
    onError: (error: Error) => {
      console.log('error', error);
    },
  },
};

const YeetDialog = () => {
  const [open, setOpen] = useState(false);
  // reset form when it's closed
  const [activeStep, setActiveStep] = useState(0);
  const form = useYeetForm();
  const {
    poolId,
    setPoolId,
    strategyAddress,
    setStrategyAddress,
    setYeetStatus,
    setYeetTx,
  } = useFormStore(s => s);
  const { network: chainId, amount: totalAmount, addresses } = form.getValues();
  const token = useSelectedToken();
  const { address } = useAccount();
  const { data: profileId } = useProfile();

  const [transactionStatus, setTransactionStatus] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '',
  });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTransactionStatus({
          status: 'idle',
          message: '',
        });
      }, 1000);
    }
  }, [open]);

  // Strategy Factory Logic
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

  // Pool Creation Logic
  const { sendTransaction: sendPoolTransaction, data: poolHash } =
    useSendTransaction(sendConfig);
  const {
    isLoading: isLoadingPool,
    isFetching: isFetchingPool,
    isSuccess: isSuccessPool,
    data: poolData,
  } = useWaitForTransactionReceipt({
    hash: poolHash,
  });

  // Yeet Logic
  const { sendTransaction: sendYeet, data: yeetHash } =
    useSendTransaction(sendConfig);
  const {
    isLoading: isLoadingYeet,
    isFetching: isFetchingYeet,
    isSuccess: isSuccessYeet,
    isError: isErrorYeet,
    data: yeetData,
  } = useWaitForTransactionReceipt({
    hash: yeetHash,
  });

  // Initialize contracts
  const strategyFactory = useMemo(() => {
    if (!chainId) return null;
    return new StrategyFactory({
      chain: chainId,
      factoryType: 'YTR',
    });
  }, [chainId]);

  const allo = useMemo(() => {
    if (!chainId) return null;
    return new Allo({ chain: chainId });
  }, [chainId]);

  const yeeter = useMemo(() => {
    if (!chainId || !poolId) return null;
    return new YeeterStrategy({
      chain: chainId,
      rpc: 'https://rpc.sepolia.org',
      address: strategyAddress as `0x${string}`,
      poolId: BigInt(poolId),
    });
  }, [chainId, poolId, strategyAddress]);

  // Transaction functions
  const createYeeterContract = useCallback(async () => {
    if (!strategyFactory) return;
    setTransactionStatus({
      status: 'loading',
      message: 'Deploying Yeeter contract...',
    });
    try {
      const createYeeterTx = strategyFactory.getCreateStrategyData();
      await sendFactoryTransaction({
        data: createYeeterTx.data,
        to: createYeeterTx.to,
        value: BigInt(createYeeterTx.value),
      });
    } catch (error) {
      setTransactionStatus({
        status: 'error',
        message: 'Failed to deploy Yeeter contract',
      });
    }
  }, [strategyFactory, sendFactoryTransaction]);

  const createPool = useCallback(async () => {
    if (
      !allo ||
      !strategyAddress ||
      !profileId ||
      !address ||
      !token ||
      !totalAmount
    )
      return;

    setTransactionStatus({
      status: 'loading',
      message: 'Creating pool...',
    });

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
      setTransactionStatus({
        status: 'error',
        message: 'Failed to create pool',
      });
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

  const yeet = useCallback(async () => {
    if (!yeeter) return;

    setTransactionStatus({
      status: 'loading',
      message: 'Yeeting funds...',
    });

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
      setTransactionStatus({
        status: 'error',
        message: 'Failed to yeet funds',
      });
    }
  }, [yeeter, sendYeet, addresses, totalAmount, token]);

  // Effects for handling transaction states
  useEffect(() => {
    if (isSuccessFactory) {
      let strategyAddress = factoryData?.logs?.[0]?.topics?.[2];
      if (strategyAddress) {
        strategyAddress = `0x${strategyAddress.slice(-40)}`;
        setStrategyAddress(strategyAddress as `0x${string}`);
        setActiveStep(1);
        setTransactionStatus({
          status: 'success',
          message: 'Yeeter contract deployed',
        });
        setTimeout(() => {
          setTransactionStatus({
            status: 'idle',
            message: 'Waiting...',
          });
        }, 1000);
      }
    }
  }, [isSuccessFactory, factoryData]);

  useEffect(() => {
    if (isSuccessPool) {
      const poolFunded = poolData?.logs?.[poolData.logs.length - 1];
      const poolId = poolFunded?.topics?.[1];
      if (poolId) {
        setPoolId(BigInt(poolId));
        setActiveStep(2);
        setTransactionStatus({
          status: 'success',
          message: 'Pool created',
        });
        setTimeout(() => {
          setTransactionStatus({
            status: 'idle',
            message: 'Waiting...',
          });
        }, 1000);
      }
    }
  }, [isSuccessPool, poolData]);

  useEffect(() => {
    if (isSuccessYeet) {
      console.log('yeetData', yeetData);
      setYeetStatus('completed');
      setYeetTx(yeetData?.transactionHash);
      setTransactionStatus({
        status: 'success',
        message: 'Funds yeeted!',
      });
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }, [isSuccessYeet]);

  const steps = [
    {
      title: 'Deploy Yeeter Contract',
      description:
        'Deploy the smart contract that will handle the distribution',
      Icon: RiFileCheckFill,
      action: createYeeterContract,
      isLoading: isLoadingFactory,
    },
    {
      title: 'Create Pool',
      description: 'Create a pool to manage the funds',
      Icon: RiHandCoinFill,
      action: createPool,
      isLoading: isLoadingPool,
    },
    {
      title: 'Yeet Funds',
      description: 'Distribute funds to all recipients',
      Icon: RiSendPlaneFill,
      action: yeet,
      isLoading: isLoadingYeet,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">
          Sign Yeet Transactions
          <RiSendPlaneFill className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] transition-all">
        {transactionStatus.status === 'idle' ? (
          <Swiper
            className="w-full"
            slidesPerView={1}
            allowTouchMove={false}
            initialSlide={activeStep}
            modules={[Pagination]}
            pagination={{
              clickable: false,
              bulletClass: 'swiper-pagination-bullet !bg-primary',
            }}
            // autoHeight
          >
            {steps.map((step, index) => (
              <SwiperSlide key={index} className="pb-4">
                <div className="flex flex-col gap-4 p-4">
                  <div className="rounded-full bg-secondary p-6 self-center">
                    {step.isLoading ? (
                      <RiLoader4Line className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <step.Icon className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {step.description}
                  </p>
                  <Button
                    onClick={step.action}
                    disabled={step.isLoading || index !== activeStep}
                  >
                    {step.isLoading ? 'Processing...' : step.title}
                    <step.Icon className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {transactionStatus.status === 'loading' && (
              <>
                <RiLoader4Line className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="font-semibold mb-2">Processing Transaction</h3>
              </>
            )}
            {transactionStatus.status === 'success' && (
              <>
                <RiCheckLine className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-semibold mb-2">Success!</h3>
              </>
            )}
            {transactionStatus.status === 'error' && (
              <>
                <RiCloseLine className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="font-semibold mb-2">Error</h3>
              </>
            )}
            <p className="text-sm text-gray-500">{transactionStatus.message}</p>
            {transactionStatus.status === 'error' && (
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() =>
                  setTransactionStatus({ status: 'idle', message: '' })
                }
              >
                Try Again
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default YeetDialog;
