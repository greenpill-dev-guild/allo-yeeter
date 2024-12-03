import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { useReadContract, useSimulateContract, useWriteContract } from 'wagmi';

type UseTokenPermissionsResult = {
  allowance: BigInt | undefined;
  requestApproval: () => void;
  isLoading: boolean;
  isSuccess: boolean;
};

export function useTokenPermissions({
  tokenAddress,
  ownerAddress,
  spender,
  amount,
}: {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spender: `0x${string}`;
  amount: bigint;
}): UseTokenPermissionsResult {
  const [allowance, setAllowance] = useState<BigInt | undefined>();
  const [needsApproval, setNeedsApproval] = useState(true);
  console.log('useTokenPermissions', { tokenAddress, ownerAddress, spender, amount });

  // Read current allowance
  const { data: readAllowance, isFetching, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spender],
  });


  // Prepare the approval transaction
  const { data } = useSimulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, amount],
  });

  const { writeContract: requestApproval, isPending, data: approvalData, status } = useWriteContract();
  console.log('readAllowance', { readAllowance, ownerAddress, spender });
  console.log('approvalData', approvalData, status);

  // Update state when the allowance changes
  useEffect(() => {
    if (needsApproval && status === 'success') {
      refetchAllowance();
    }
    if (readAllowance) {
      setAllowance(readAllowance);
      setNeedsApproval(readAllowance < amount);
    }
  }, [readAllowance, amount, approvalData, status]);

  return {
    allowance,
    isLoading: isPending || isFetching,
    isSuccess: status === 'success' || !needsApproval,
    requestApproval: () => requestApproval(data!.request),
  };
}