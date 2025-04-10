import { TChain } from "../../../types";
import { daiIcon, fantomIcon, gcvIcon, usdcIcon } from "../../icons";

export const fantom: TChain = {
  id: 250,
  name: "fantom",
  prettyName: "Fantom",
  type: "mainnet",
  blockExplorer: "https://ftmscan.com/",
  icon: fantomIcon,
  rpc: "https://rpcapi.fantom.network",
  pricesFromTimestamp: 1667354777,
  coingeckoId: "fantom",
  contracts: {
    multiRoundCheckout: "0x03506eD3f57892C85DB20C36846e9c808aFe9ef4",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 4,
    directAllocationStrategyAddress:
      "0xf4ad959b0eceab17648cb964c3a1feadba8a5053",
  },
  tokens: [
    {
      code: "USDC",
      icon: usdcIcon,
      address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      decimals: 6,
      canVote: true,
      priceSource: {
        chainId: 250,
        address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      },
      redstoneTokenId: "USDC",
    },
    {
      code: "BUSD",
      address: "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50",
      decimals: 18,
      icon: "BUSD",
      canVote: true,
      priceSource: {
        chainId: 250,
        address: "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50",
      },
      redstoneTokenId: "BUSD",
    },
    {
      code: "DAI",
      icon: daiIcon,
      address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 250,
        address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      },
      redstoneTokenId: "DAI",
    },
    {
      code: "FTM",
      icon: fantomIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 250,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "FTM",
    },
    {
      code: "FTM",
      icon: fantomIcon,
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "FTM",
    },
    {
      code: "GcV",
      icon: gcvIcon,
      address: "0x83791638da5EB2fAa432aff1c65fbA47c5D29510",
      decimals: 18,
      voteAmountCap: BigInt("1000000000000000000"),
      canVote: false,
      priceSource: {
        chainId: 250,
        address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      },
      redstoneTokenId: "GcV",
    },
    {
      code: "WFTM",
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      decimals: 18,
      icon: fantomIcon,
      canVote: true,
      priceSource: {
        chainId: 250,
        address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      },
      redstoneTokenId: "FTM",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174",
      fromBlock: 65169115,
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0xfb08d1fD3a7c693677eB096E722ABf4Ae63B0B95",
      fromBlock: 66509340,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x534d2AAc03dCd0Cb3905B591BAf04C14A95426AB",
      fromBlock: 66509340,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0xFA1D9FF7F885757fc20Fdd9D78B72F88B00Cff77",
      fromBlock: 66509340,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0x9B1Ee60B539a3761E328a621A3d980EE9385679a",
      fromBlock: 66509340,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0x4d1f64c7920262c8F78e989C9E7Bf48b7eC02Eb5",
      fromBlock: 65169115,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 77624278,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 77624963,
    },
  ],
};
