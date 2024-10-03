import { useChainId } from "wagmi";
import { supportedChains } from "../api/web3-provider";

export function useNetwork() {
  const chainId = useChainId();
  const network = supportedChains?.find((chain) => chain.id === chainId);
  return network;
}
