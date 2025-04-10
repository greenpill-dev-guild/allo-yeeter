import { TChain } from "../../../types";
import { seiIcon, usdcIcon } from "../../icons";

export const seiMainnet: TChain = {
  id: 1329,
  name: "sei-mainnet",
  prettyName: "SEI",
  type: "mainnet",
  blockExplorer: "https://seitrace.com/",
  icon: seiIcon,
  rpc: "https://evm-rpc.sei-apis.com",
  pricesFromTimestamp: 1704067200,
  coingeckoId: "sei-v2",
  contracts: {
    multiRoundCheckout: "0x1E18cdce56B3754c4Dca34CB3a7439C24E8363de",
    quadraticFunding: "0xf5cA96151d1a9998d234963433bfd3f6feC7aAc2",
    directGrants: "0xf24C89aF130Bb1ca22FD458BB9eeFA344aBC1573",
  },
  tokens: [
    {
      code: "SEI",
      icon: seiIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1329,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "SEI",
    },
    {
      code: "SEI",
      icon: seiIcon,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1329,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "SEI",
    },
    {
      code: "USDC",
      icon: usdcIcon,
      address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1329,
        address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
      },
      redstoneTokenId: "USDC",
    }
  ],
  subscriptions: [
    // Allo V2
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      fromBlock: 78000000,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 78000000,
    },
  ],
};
