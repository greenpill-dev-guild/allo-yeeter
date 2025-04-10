import { TChain } from "../../../types";
import svgIcon from "../../icons/gnosis";
import { usdcIcon } from "../../icons";

export const gnosis: TChain = {
  id: 100, // chain id
  name: "gnosis", // chain name
  prettyName: "Gnosis", // pretty network name
  type: "mainnet", // chain type: "mainnet" or "testnet"
  coingeckoId: "xdai",
  blockExplorer: "https://gnosisscan.io/",
  icon: svgIcon, // imported svg icon
  rpc: "https://rpc.gnosischain.com", // public rpc url
  contracts: {
    multiRoundCheckout: "0xDE915119349E817f5012fa03f88F5C784d56A1fE",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 1,
    directAllocationStrategyAddress:
      "0x56662F9c0174cD6ae14b214fC52Bd6Eb6B6eA602",
  },
  pricesFromTimestamp: 0, // timestamp to get prices from
  tokens: [
    {
      code: "xDAI", // native token symbol
      icon: svgIcon, // imported svg icon
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 100, // chain id
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "DAI", // xDAI not supported.
    },
    {
      code: "xDAI",
      icon: svgIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 100,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "DAI",
    },
    {
      code: "USDC", // ERC-20 token symbol
      icon: usdcIcon, // imported svg icon
      address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83", // token address
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 100, // chain id
        address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83", // token address
      },
      redstoneTokenId: "USDC",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3", // contract address of Registry
      fromBlock: 35900000, // block number
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1", // contract address of Allo
      fromBlock: 35900000, // block number
    },
  ],
};
