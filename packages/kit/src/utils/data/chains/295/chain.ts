import { TChain } from "../../../types";
import { hederaIcon, usdcIcon } from "../../icons";

export const hedera: TChain = {
  id: 295, // chain id
  name: "hedera-hashgraph", // chain name
  prettyName: "Hedera", // pretty network name
  type: "mainnet", // chain type: "mainnet" or "testnet"
  blockExplorer: "https://hashscan.io/mainnet/",
  icon: hederaIcon, // imported svg icon
  rpc: "https://mainnet.hashio.io/api", // public rpc url
  coingeckoId: "hedera-hashgraph",
  contracts: {
    multiRoundCheckout: "0x1E18cdce56B3754c4Dca34CB3a7439C24E8363de",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 1,
    directAllocationStrategyAddress: "0x56662F9c0174cD6ae14b214fC52Bd6Eb6B6eA602",
  },  pricesFromTimestamp: 0, // timestamp to get prices from
  tokens: [
    {
      code: "HBAR", // native token symbol
      icon: hederaIcon, // imported svg icon
      address: "0x0000000000000000000000000000000000000000",
      decimals: 8,
      canVote: true, // true for native currency and stable coins, protocol and other are false
      priceSource: {
        chainId: 295, // chain id
        address: "0x0000000000000000000000000000000000000000",
      },
      // see: https://github.com/redstone-finance/redstone-node/blob/main/src/config/tokens.json
      redstoneTokenId: "HBAR", // redstone token id
    },
    {
      code: "HBAR", // native token symbol
      icon: hederaIcon, // imported svg icon
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 8,
      canVote: true, // true for native currency and stable coins, protocol and other are false
      priceSource: {
        chainId: 295, // chain id
        address: "0x0000000000000000000000000000000000000000",
      },
      // see: https://github.com/redstone-finance/redstone-node/blob/main/src/config/tokens.json
      redstoneTokenId: "HBAR", // redstone token id
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3", // contract address of Registry
      fromBlock: 75239000, // block number
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1", // contract address of Allo
      fromBlock: 75239000, // block number
    },
  ],
};
