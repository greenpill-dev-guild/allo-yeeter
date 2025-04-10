import { TChain } from "../../../types";
import { daiIcon, ethIcon, usdcIcon } from "../../icons";
import ebtc from "../../icons/ebtc";

export const mainnet: TChain = {
  id: 1,
  name: "mainnet",
  prettyName: "Ethereum",
  type: "mainnet",
  blockExplorer: "https://etherscan.io/",
  icon: ethIcon,
  rpc: "https://ethereum-rpc.publicnode.com/",
  coingeckoId: "ethereum",
  pricesFromTimestamp: 1667354777,
  maxGetLogsRange: 0,
  contracts: {
    multiRoundCheckout: "0x3bA9DF642f5e895DC76d3Aa9e4CE8291108E65b1",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 11,
    directAllocationStrategyAddress:
      "0xef78f18f49dea8b8a5caa41633bb50b0666d40f1",
    ensUniversalResolver: "0xce01f8eee7E479C928F8919abD53E553a36CeF67",
  },
  tokens: [
    {
      code: "USDC",
      icon: usdcIcon,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      permitVersion: "2",
      redstoneTokenId: "USDC",
    },
    {
      code: "DAI",
      icon: daiIcon,
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      redstoneTokenId: "DAI",
    },
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
      code: "CVP",
      icon: "",
      address: "0x38e4adB44ef08F22F5B5b76A8f0c2d0dCbE7DcA1",
      decimals: 18,
      canVote: false,
      priceSource: {
        chainId: 1,
        address: "0x38e4adB44ef08F22F5B5b76A8f0c2d0dCbE7DcA1",
      },
      redstoneTokenId: "CVP",
    },
    {
      code: "mkUSD",
      icon: "",
      address: "0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28",
      decimals: 18,
      canVote: false,
      priceSource: {
        chainId: 1,
        address: "0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28",
      },
      redstoneTokenId: "mkUSD",
    },
    {
      code: "eBTC",
      icon: ebtc,
      address: "0x661c70333aa1850ccdbae82776bb436a0fcfeefb",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x661c70333aa1850ccdbae82776bb436a0fcfeefb",
      },
      redstoneTokenId: "eBTC",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0x03506eD3f57892C85DB20C36846e9c808aFe9ef4",
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0x9Cb7f434aD3250d1656854A9eC7A71EceC6eE1EF",
      fromBlock: 16994474,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x4a850F463D1C4842937c5Bc9540dBc803D744c9F",
      fromBlock: 16994526,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0x8F8d78f119Aa722453d33d6881f4D400D67D054F",
      fromBlock: 16994526,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0xd07D54b0231088Ca9BF7DA6291c911B885cBC140",
      fromBlock: 16994526,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0x56296242CA408bA36393f3981879fF9692F193cC",
      fromBlock: 16994451,
    },
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3",
      fromBlock: 18486688,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 18486975,
    },
  ],
};
