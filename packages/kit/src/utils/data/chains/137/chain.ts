import { TChain } from "../../../types";
import { dataIcon, polygonIcon, usdGloIcon, usdcIcon } from "../../icons";

export const polygon: TChain = {
  id: 137,
  name: "polygon",
  prettyName: "Polygon",
  type: "mainnet",
  blockExplorer: "https://polygonscan.com/",
  icon: polygonIcon,
  rpc: "https://polygon-rpc.com",
  pricesFromTimestamp: 1692497177,
  coingeckoId: "polygon-pos",
  maxGetLogsRange: 0,
  contracts: {
    multiRoundCheckout: "0xe04d9e9CcDf65EB1Db51E56C04beE4c8582edB73",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
  },
  tokens: [
    {
      code: "POL",
      icon: polygonIcon,
      address: "0x0000000000000000000000000000000000000000",
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
      icon: polygonIcon,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
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
      icon: usdcIcon,
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      permitVersion: "2",
      redstoneTokenId: "USDC",
    },
    {
      code: "DATA",
      icon: dataIcon,
      address: "0x3a9A81d576d83FF21f26f325066054540720fC34",
      decimals: 18,
      canVote: false,
      priceSource: {
        chainId: 1,
        address: "0x8f693ca8d21b157107184d29d398a8d082b38b76",
      },
      redstoneTokenId: "DATA",
    },
    {
      code: "USDGLO",
      icon: usdGloIcon,
      address: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 10,
        address: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
      },
      redstoneTokenId: "CUSD", // USDGLO not supported by Redstone. So setting the price temporrarily to CUSD
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0x5C5E2D94b107C7691B08E43169fDe76EAAB6D48b",
      fromBlock: 47215935,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0x5ab68dCdcA37A1C2b09c5218e28eB0d9cc3FEb03",
      fromBlock: 47215935,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0xc1a26b0789C3E93b07713e90596Cad8d0442C826",
      fromBlock: 47215935,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0xD0e19DBF9b896199F35Df255A1bf8dB3C787531c",
      fromBlock: 47215935,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0xF2a07728107B04266015E67b1468cA0a536956C8",
      fromBlock: 47215935,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0xF7c101A95Ea4cBD5DA0Ab9827D7B2C9857440143",
      fromBlock: 47215935,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 49466006,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 49467628,
    },
  ],
};
