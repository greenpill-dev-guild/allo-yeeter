import { TChain } from "../../../types";
import { polygonIcon, usdcIcon } from "../../icons";

export const polygonMumbai: TChain = {
  id: 80001,
  name: "polygon-mumbai",
  prettyName: "Polygon Mumbai",
  type: "testnet",
  blockExplorer: "https://mumbai.polygonscan.com/",
  icon: polygonIcon,
  coingeckoId: "polygon-pos",
  rpc: "https://rpc-mumbai.maticvigil.com/",
  pricesFromTimestamp: 1704164777,
  contracts: {
    multiRoundCheckout: "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
  },
  tokens: [
    {
      code: "POL",
      address: "0x0000000000000000000000000000000000000000",
      icon: polygonIcon,
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      },
      redstoneTokenId: "MATIC",
    },
    {
      code: "POL",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      icon: polygonIcon,
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      },
      redstoneTokenId: "MATIC",
    },
    {
      code: "USDC",
      address: "0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97",
      icon: usdcIcon,
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      permitVersion: "2",
      redstoneTokenId: "USDC",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0x545B282A50EaeA01A619914d44105437036CbB36",
      fromBlock: 39793132,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0xE1c5812e9831bc1d5BDcF50AAEc1a47C4508F3fA",
      fromBlock: 39793132,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0xF7c101A95Ea4cBD5DA0Ab9827D7B2C9857440143",
      fromBlock: 39793132,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0xc1a26b0789C3E93b07713e90596Cad8d0442C826",
      fromBlock: 39793132,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0xD9B7Ce1F68A93dF783A8519ed52b74f5DcF5AFE1",
      fromBlock: 39793132,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
      fromBlock: 39793132,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 41939383,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 41940805,
    },
  ],
};
