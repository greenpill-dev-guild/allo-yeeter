import { TChain } from "../../../types";
import { celoIcon } from "../../icons";

export const celoTestnet: TChain = {
  id: 44787,
  name: "celo-testnet",
  prettyName: "Celo Alfajores",
  type: "testnet",
  blockExplorer: "https://alfajores.celoscan.io/",
  icon: celoIcon,
  rpc: "https://alfajores-forno.celo-testnet.org",
  pricesFromTimestamp: 1704164777,
  coingeckoId: "celo",
  contracts: {
    multiRoundCheckout: "0x8Ad0a1111B3d8453Ea9C444cA7d708A65BF81Def",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
  },
  tokens: [
    {
      code: "CELO",
      icon: celoIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42220,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "CELO",
    },
    {
      code: "CELO",
      icon: celoIcon,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42220,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "CELO",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      fromBlock: 23061115,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 23061115,
    },
  ],
};
