import React, { useState, useMemo } from 'react';
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
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { parseEther } from 'viem';
import { SlideProps } from './slideDefinitions';
import { Button } from '@/components/ui/button';
import { useProfile } from '@allo-team/kit';

const Confirm: React.FC<SlideProps> = ({
  form,
  swiper,
  toast,
  nextButtonText,
}) => {
  const { network: chainId, token, amount: totalAmount } = form.getValues();
  const { address } = useAccount();
  const { sendTransaction, data: hash } = useSendTransaction();
  const { sendTransaction: sendPoolTransaction, data: poolHash } =
    useSendTransaction({
      mutation: {
        onError: error => {
          console.log('error', error);
        },
      },
    });
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

  // const { data: hash, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { sendTransaction: sendYeet, data: yeetHash } = useSendTransaction();
  const [error, setError] = useState<string | null>(null);
  console.log({ yeetHash, hash });

  const handleConfirm = async () => {
    setError(null);
    const data = form.getValues();
    // console.log('Form submitted:', data);
    const totalAmount = parseFloat(data.amount);
    const amountPerAddress = totalAmount / data.addresses.length;

    const dataForContract = {
      recipientIds: data.addresses.map(
        address => address.address,
      ) as `0x${string}`[],
      amounts: data.addresses.map(() => BigInt(amountPerAddress)) as bigint[],
      token: data.token as `0x${string}`,
    };

    const args: CreatePoolArgs = {
      profileId: profileId as `0x${string}`, // TODO: better err handling
      strategy: '0x3B7AD76762a6d6D652664F35696c57552b7411dD',
      initStrategyData: '0x',
      token: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      // token: token as `0x${string}`,
      amount: BigInt(10000),
      metadata: {
        protocol: BigInt(1),
        pointer: 'Test',
      },
      managers: [address as `0x${string}`],
    };
    console.log('args', args);

    if (!allo) return;

    const poolTx: TransactionData = allo.createPoolWithCustomStrategy(args);
    // const poolTx: TransactionData = allo.createPool(args);
    console.log('poolTx', { token, totalAmount, address }, poolTx);

    const poolReceipt = await sendPoolTransaction({
      data: poolTx.data,
      to: poolTx.to,
      value: BigInt(poolTx.value),
      gas: BigInt(20_000_000),
      gasPrice: BigInt(1_000_000_000),
    });
    console.log('poolReceipt', poolReceipt, poolHash);
    return;

    const tx = strategyFactory.getCreateStrategyData();
    console.log('tx', tx);

    if (!address) {
      setError('No wallet connected');
      return;
    }

    if (chainId !== data.network) {
      setError('Wrong network');
      return;
    }

    try {
      // await sendTransaction(tx);
      const Yeeter = new YeeterStrategy({
        chain: parseInt(data.network),
        // rpc: data.rpc,
        address: '0x3B7AD76762a6d6D652664F35696c57552b7411dD',
        // address: data.address,
        poolId: 1,
      });
      const yeeterTx = Yeeter.getAllocateData(dataForContract);
      await sendYeet(yeeterTx);
    } catch (err) {
      setError(
        'Transaction failed: ' +
          (err instanceof Error ? err.message : String(err)),
      );
      toast({
        title: 'Transaction Failed',
        description: error,
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      console.log('Transaction successful');
      swiper?.slideNext();
      toast({
        title: 'Transaction Successful',
        description: 'Your Yeet has been confirmed!',
        variant: 'success',
      });
    }
  }, [isSuccess, swiper, toast]);

  return (
    <div>
      <h2>Confirm Your Yeet</h2>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      <Button onClick={handleConfirm} disabled={isLoading}>
        {isLoading ? 'Processing...' : nextButtonText}
      </Button>
      {isLoading && <p>Transaction is being processed...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Confirm;
