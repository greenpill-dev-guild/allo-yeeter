import { useNetwork } from '@allo-team/kit';
import { useFormStore } from '@/store/form';
import { TToken } from '@gitcoin/gitcoin-chain-data';

export const useSelectedToken = ():
  | TToken
  | { address: string; code: string; decimals: number; canVote?: boolean }
  | undefined => {
  const tokenAddress = useFormStore(state => state.token);
  const customToken = useFormStore(state => state.customToken);
  const network = useNetwork();

  if (customToken?.address) {
    return customToken;
  }

  const token = network?.tokens?.find(t => t.address === tokenAddress);

  return token;
};
