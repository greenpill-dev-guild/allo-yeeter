import { TChain } from "../../../types";
import { ethIcon, scrollIcon } from "../../icons";

export const scrollSepolia: TChain = {
  id: 534351,
  name: "scroll-sepolia",
  prettyName: "Scroll Sepolia",
  type: "testnet",
  blockExplorer: "https://sepolia.scrollscan.com",
  icon: scrollIcon,
  rpc: "https://sepolia-rpc.scroll.io",
  coingeckoId: "ethereum",
  pricesFromTimestamp: 1704164777,
  contracts: {
    multiRoundCheckout: "0x8Bd6Bc246FAF14B767954997fF3966CD1c0Bf0f5",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
  },
  tokens: [
    {
      code: "ETH",
      icon: ethIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "ETH",
    },
    {
      code: "ETH",
      icon: ethIcon,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "ETH",
    },
    {
      code: "MTK",
      icon: "",
      address: "0xc2332031de487f430fae3290c05465d907785eda",
      decimals: 18,
      canVote: false,
      priceSource: {
        chainId: 1,
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      redstoneTokenId: "MTK",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0xA78Daa89fE9C1eC66c5cB1c5833bC8C6Cb307918",
      fromBlock: 2774478,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0xF2a07728107B04266015E67b1468cA0a536956C8",
      fromBlock: 2774478,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x545B282A50EaeA01A619914d44105437036CbB36",
      fromBlock: 2774478,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0xd07D54b0231088Ca9BF7DA6291c911B885cBC140",
      fromBlock: 2774478,
    },
  ],
};
