import { TChain } from "../../../types";
import { seiIcon } from "../../icons";

export const seiDevnet: TChain = {
  id: 713715,
  name: "sei-devnet",
  prettyName: "SEI Devnet",
  type: "testnet",
  blockExplorer: "https://seitrace.com/?chain=arctic-1",
  icon: seiIcon,
  rpc: "https://evm-rpc-arctic-1.sei-apis.com",
  pricesFromTimestamp: 1704164777,
  coingeckoId: "sei-v2",
  contracts: {
    multiRoundCheckout: "0x313eC6CA225C40Bc670d8cd4b063734BD22ad1ab",
    quadraticFunding: "0x029dFAf686DfA0efdace5132ba422e9279D50b5b",
    directGrants: "0xdA62767Da1402398d81C8288b37DE1CC8C8fDcA0",
  },
  tokens: [
    {
      code: "SEI",
      icon: seiIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 713715,
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
        chainId: 713715,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "SEI",
    },
    {
      code: "WSEI",
      icon: seiIcon,
      address: "0x26841a0A5D958B128209F4ea9a1DD7E61558c330",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 713715,
        address: "0x26841a0A5D958B128209F4ea9a1DD7E61558c330",
      },
      redstoneTokenId: "SEI",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      fromBlock: 14660337,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 14661917,
    },
  ],
};
