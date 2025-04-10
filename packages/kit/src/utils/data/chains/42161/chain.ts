import { TChain } from "../../../types";
import {
  arbitrumIcon,
  ethIcon,
  gtcIcon,
  usdGloIcon,
  usdcIcon,
} from "../../icons";

export const arbitrum: TChain = {
  id: 42161,
  name: "arbitrum",
  prettyName: "Arbitrum One",
  type: "mainnet",
  blockExplorer: "https://arbiscan.io/",
  icon: arbitrumIcon,
  rpc: "https://arbitrum-one.publicnode.com/",
  coingeckoId: "arbitrum-one",
  pricesFromTimestamp: 1688263577,
  contracts: {
    multiRoundCheckout: "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 390,
    directAllocationStrategyAddress:
      "0x91ad709fe04e214ef53218572d8d8690a8b4fdd0",
    retroFunding: "0x3ef485b9776a48587e0469954065e9568E914B58",
  },
  tokens: [
    {
      code: "USDC",
      icon: usdcIcon,
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 42161,
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
      permitVersion: "2",
      redstoneTokenId: "USDC",
    },
    {
      code: "ARB",
      icon: arbitrumIcon,
      address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42161,
        address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      },
      redstoneTokenId: "ARB",
    },
    {
      code: "USDGLO",
      icon: usdGloIcon,
      address: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42161,
        address: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
      },
      redstoneTokenId: "CUSD", // USDGLO not supported by Redstone. So setting the price temporrarily to CUSD
    },
    {
      code: "ETH",
      icon: ethIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 42161,
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
        chainId: 42161,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "ETH",
    },
    {
      code: "GTC",
      icon: gtcIcon,
      address: "0x7f9a7db853ca816b9a138aee3380ef34c437dee0",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
      },
      redstoneTokenId: "GTC",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0x73AB205af1476Dc22104A6B8b3d4c273B58C6E27",
      fromBlock: 123566896,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0xF2a07728107B04266015E67b1468cA0a536956C8",
      fromBlock: 123566896,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0xC3A195EEa198e74D67671732E1B8F8A23781D735",
      fromBlock: 123566896,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0x04b194b14532070F5cc8D3A760c9a0957D85ad5B",
      fromBlock: 123566896,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0xc1a26b0789C3E93b07713e90596Cad8d0442C826",
      fromBlock: 123566896,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
      fromBlock: 123566896,
    },
    {
      contractName: "AlloV2/AlloV1ToV2ProfileMigration",
      address: "0x1bFda15Ad5FC82E74Da81F0B8DcA486b3Ad14c71",
      fromBlock: 191943906,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 146489425,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 146498081,
    },
  ],
};
