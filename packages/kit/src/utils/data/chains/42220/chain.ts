import { TChain } from "../../../types";
import { celoIcon, cusdIcon, usdGloIcon, gooddollarIcon } from "../../icons";

export const celoMainnet: TChain = {
  id: 42220,
  name: "celo-mainnet",
  prettyName: "Celo",
  type: "mainnet",
  blockExplorer: "https://celoscan.io/",
  icon: celoIcon,
  rpc: "https://forno.celo.org",
  coingeckoId: "celo",
  pricesFromTimestamp: 1704164777,
  contracts: {
    multiRoundCheckout: "0xb1481E4Bb2a018670aAbF68952F73BE45bdAD62D",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 12,
    directAllocationStrategyAddress:
      "0x9da0a7978b7bd826e06800427cbf1ec1200393e3",
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
    {
      code: "CUSD",
      icon: cusdIcon,
      address: "0x765de816845861e75a25fca122bb6898b8b1282a",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42220,
        address: "0x765de816845861e75a25fca122bb6898b8b1282a",
      },
      redstoneTokenId: "CUSD",
    },
    {
      code: "USDGLO",
      icon: usdGloIcon,
      address: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42220,
        address: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
      },
      redstoneTokenId: "CUSD", // USDGLO not supported by Redstone. So setting the price temporrarily to CUSD
    },
    {
      code: "G$",
      icon: gooddollarIcon,
      address: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42220,
        address: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
      },
      redstoneTokenId: "", // G$ not supported by Redstone. So setting the price temporrarily to ""
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      fromBlock: 22257000,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 22258000,
    },
  ],
};
