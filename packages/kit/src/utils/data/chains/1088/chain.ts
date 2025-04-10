import { TChain } from "../../../types";
import { metisIcon } from "../../icons";

export const metis: TChain = {
  id: 1088, // chain id
  name: "metis-andromeda", // chain name
  prettyName: "Metis Andromeda", // pretty network name
  type: "mainnet", // chain type: "mainnet" or "testnet"
  blockExplorer: "https://andromeda-explorer.metis.io/",
  icon: metisIcon, // imported svg icon
  rpc: "https://andromeda.metis.io/?owner=1088", // public rpc url
  coingeckoId: "metis-andromeda",
  contracts: {
    multiRoundCheckout: "0x710172b2C0aCc629A3FD23D436c347807dD5C412",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 1,
    directAllocationStrategyAddress:
      "0xef78f18f49dea8b8a5caa41633bb50b0666d40f1",
  },
  pricesFromTimestamp: 0, // timestamp to get prices from
  tokens: [
    {
      code: "METIS", // native token symbol
      icon: metisIcon, // imported svg icon
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true, // true for native currency and stable coins, protocol and other are false
      priceSource: {
        chainId: 1, // chain id
        address: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
      },
      // see: https://github.com/redstone-finance/redstone-node/blob/main/src/config/tokens.json
      redstoneTokenId: "METIS", // redstone token id
    },
    {
      code: "METIS", // native token symbol
      icon: metisIcon, // imported svg icon
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1, // chain id
        address: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
      },
      redstoneTokenId: "METIS", // redstone token id
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3", // contract address of Registry
      fromBlock: 17860000, // block number
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1", // contract address of Allo
      fromBlock: 17860000, // block number
    },
  ],
};
