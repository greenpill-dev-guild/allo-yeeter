import { TChain } from "../../../types";
import { ethIcon, scrollIcon, usdcIcon } from "../../icons";

export const scrollMainnet: TChain = {
  id: 534352,
  name: "scroll-mainnet",
  prettyName: "Scroll",
  type: "mainnet",
  blockExplorer: "https://scrollscan.com/",
  icon: scrollIcon,
  rpc: "https://rpc.scroll.io",
  coingeckoId: "scroll",
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
      code: "USDC",
      icon: usdcIcon,
      address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      permitVersion: "2",
      redstoneTokenId: "USDC",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0x29aAF7D4E83A778DAee08Fe04B0712c4C2989AD1",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x5b55728e41154562ee80027C1247B13382692e5C",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0x545B282A50EaeA01A619914d44105437036CbB36",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0xc7722909fEBf7880E15e67d563E2736D9Bb9c1Ab",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0x7ac74Be34b1A27E48a2525259719F877a57B2Aa4",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x5b55728e41154562ee80027C1247B13382692e5C",
      fromBlock: 2683205,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 2683205,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 2683205,
    },
  ],
};
