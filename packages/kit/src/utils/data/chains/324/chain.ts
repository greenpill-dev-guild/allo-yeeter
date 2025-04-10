import { TChain } from "../../../types";
import {
  daiIcon,
  ethIcon,
  lusdIcon,
  muteIcon,
  usdcIcon,
  usdtIcon,
  zkeraIcon,
} from "../../icons";

export const zkSyncEraMainnet: TChain = {
  id: 324,
  name: "zksync-era-mainnet",
  prettyName: "zkSync Era",
  type: "mainnet",
  blockExplorer: "https://explorer.zksync.io/",
  icon: zkeraIcon,
  rpc: "https://mainnet.era.zksync.io",
  pricesFromTimestamp: 1701486377,
  coingeckoId: "zksync",
  contracts: {
    multiRoundCheckout: "0x9FD009C448ce9b5DD7D609BFaf7C1C8fb91fb3ff",
    quadraticFunding: "0x61E288cf14f196CF8a6104ec421ae17c7f16a749",
    directGrants: "0x9710eedFD45a2ce5E6b09303a1E51c0cd600Fc88",
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
      code: "USDC.e",
      icon: usdcIcon,
      address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      redstoneTokenId: "USDC",
    },
    {
      code: "USDC",
      icon: usdcIcon,
      address: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      redstoneTokenId: "USDC",
    },
    {
      code: "USDT",
      icon: usdtIcon,
      address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      redstoneTokenId: "USDT",
    },
    {
      code: "DAI",
      icon: daiIcon,
      address: "0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      redstoneTokenId: "DAI",
    },
    {
      code: "LUSD",
      icon: lusdIcon,
      address: "0x503234F203fC7Eb888EEC8513210612a43Cf6115",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
      },
      redstoneTokenId: "LUSD",
    },
    {
      code: "MUTE",
      icon: muteIcon,
      address: "0x0e97c7a0f8b2c9885c8ac9fc6136e829cbc21d42",
      decimals: 18,
      canVote: false,
      priceSource: {
        chainId: 1,
        address: "0xa49d7499271ae71cd8ab9ac515e6694c755d400c",
      },
      redstoneTokenId: "MUTE",
    },
  ],
  subscriptions: [
    {
      address: "0xe6CCEe93c97E20644431647B306F48e278aFFdb9",
      contractName: "AlloV1/ProjectRegistry/V2",
      fromBlock: 20900000,
    },
    {
      address: "0xF3B5a0d59C6292BD0e4f8Cf735EEF52b98f428E6",
      contractName: "AlloV1/RoundFactory/V2",
      fromBlock: 20900000,
    },
    {
      address: "0x94cB638556d3991363102431d8cE9e839C734677",
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      fromBlock: 20900000,
    },
    {
      address: "0x41A8F19C6CB88C9Cc98d29Cb7A4015629910fFc0",
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      fromBlock: 20900000,
    },
    {
      address: "0x0ccdfCB7e5DB60AAE5667d1680B490F7830c49C8",
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      fromBlock: 20900000,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0x68a14AF71BFa0FE09fC937033f6Ea5153c0e75e4",
      fromBlock: 20907048,
    },
    {
      contractName: "AlloV2/Registry/V1",
      address: "0xaa376Ef759c1f5A8b0B5a1e2FEC5C23f3bF30246",
      fromBlock: 31154341,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x9D1D1BF2835935C291C0f5228c86d5C4e235A249",
      fromBlock: 31154408,
    },
  ],
};
