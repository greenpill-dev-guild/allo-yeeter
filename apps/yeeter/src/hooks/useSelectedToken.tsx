import { useNetwork } from '@allo-team/kit';
import { useFormStore } from '@/store/form';

export const useSelectedToken = () => {
  const tokenAddress = useFormStore(state => state.token);
  const customToken = useFormStore(state => state.customToken);
  const network = useNetwork();

  if (customToken?.address) {
    return customToken;
  }

  return network?.tokens?.find(t => t.address === tokenAddress);
};
