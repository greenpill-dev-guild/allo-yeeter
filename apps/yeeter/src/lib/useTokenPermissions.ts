import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { useReadContract, useSimulateContract, useWriteContract } from 'wagmi';

type UseTokenPermissionsResult = {
  allowance: BigInt | undefined;
  needsApproval: boolean;
  requestApproval: () => void;
};

export function useTokenPermissions({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  amount,
}: {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amount: bigint;
}): UseTokenPermissionsResult {
  const [allowance, setAllowance] = useState<BigInt | undefined>();
  const [needsApproval, setNeedsApproval] = useState(true);

  // Read current allowance
  const { data: readAllowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress],
  });

  // Prepare the approval transaction
  const { data } = useSimulateContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount],
  });

  const { writeContract: requestApproval } = useWriteContract();

  // Update state when the allowance changes
  useEffect(() => {
    if (readAllowance) {
      setAllowance(readAllowance);
      setNeedsApproval(BigInt(readAllowance.toString()) < amount);
    }
  }, [readAllowance, amount]);

  return {
    allowance,
    needsApproval,
    requestApproval: () => requestApproval(data!.request),
  };
}