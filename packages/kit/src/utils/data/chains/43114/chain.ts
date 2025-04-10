import { TChain } from "../../../types";
import { avalancheIcon, usdcIcon } from "../../icons";

export const avalanche: TChain = {
  id: 43114,
  name: "avalanche",
  prettyName: "Avalanche",
  type: "mainnet",
  blockExplorer: "https://avascan.info/",
  icon: avalancheIcon,
  rpc: "https://rpc.ankr.com/avalanche",
  pricesFromTimestamp: 1692497177,
  coingeckoId: "avalanche",
  contracts: {
    multiRoundCheckout: "0xe04d9e9CcDf65EB1Db51E56C04beE4c8582edB73",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 15,
    directAllocationStrategyAddress:
      "0xcdf62dd1f9f9f412485dba39b491af9e09d81652",
  },
  tokens: [
    {
      code: "AVAX",
      icon: avalancheIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 43114,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "AVAX",
    },
    {
      code: "AVAX",
      icon: avalancheIcon,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 43114,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "AVAX",
    },
    {
      code: "USDC",
      icon: usdcIcon,
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
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
      address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
      fromBlock: 34540051,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0x8eC471f30cA797FD52F9D37A47Be2517a7BD6912",
      fromBlock: 34540051,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x2AFA4bE0f2468347A2F086c2167630fb1E58b725",
      fromBlock: 34540051,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0x27efa1C90e097c980c669AB1a6e326AD4164f1Cb",
      fromBlock: 34540051,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0x8AdFcF226dfb2fA73788Ad711C958Ba251369cb3",
      fromBlock: 34540051,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0xd07D54b0231088Ca9BF7DA6291c911B885cBC140",
      fromBlock: 34540051,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 34540051,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 34540051,
    },
  ],
};
