import { TChain } from "../../../types";
import { daiIcon, ethIcon, usdcIcon } from "../../icons";

export const sepolia: TChain = {
  id: 11155111,
  name: "sepolia",
  prettyName: "Sepolia",
  type: "testnet",
  blockExplorer: "https://sepolia.etherscan.io/",
  icon: ethIcon,
  rpc: "https://ethereum-sepolia.publicnode.com",
  coingeckoId: "ethereum",
  pricesFromTimestamp: 1667354777,
  contracts: {
    multiRoundCheckout: "0xa54A0c7Bcd37745f7F5817e06b07E2563a07E309",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 386,
    directAllocationStrategyAddress:
      "0xd60BCfa8714949c478d88da51A7450703A32Cf35",
    retroFunding: "0xc3840647beB1f2026D2Ab1d6056DC6b953eEf212",
  },
  tokens: [
    {
      code: "DAI",
      icon: daiIcon,
      address: "0x8db0F9eE54753B91ec1d81Bf68074Be82ED30fEb",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      },
      redstoneTokenId: "DAI",
    },
    {
      code: "DAI(GS)",
      icon: daiIcon,
      address: "0xa9dd7983B57E1865024d27110bAB098B66087e8F",
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
      code: "USDC",
      icon: usdcIcon,
      address: "0x78e0D07C4A08adFfe610113310163b40E7e47e81",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 1,
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      redstoneTokenId: "USDC",
    },
  ],
  subscriptions: [
    {
      address: "0x2420EABfA2C0e6f77E435B0B7615c848bF4963AF",
      contractName: "AlloV1/ProjectRegistry/V2",
      fromBlock: 4738892,
    },
    {
      address: "0xF1d4F5f21746bCD75fD71eB18992443f4F0edb6f",
      contractName: "AlloV1/RoundFactory/V2",
      fromBlock: 4738000,
    },
    {
      address: "0xf5D111B57de221774866AC32c4435841F5c141D5",
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      fromBlock: 4738000,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0xB5CF3fFD3BDfC6A124aa9dD96fE14118Ed8083e5",
      fromBlock: 4738000,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0xC2B0d8dAdB88100d8509534BB8B5778d1901037d",
      fromBlock: 4738000,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0x79Ba35cb31620db1b5b101A9A13A1b0A82B5BC9e",
      fromBlock: 4738000,
    },
    {
      address: "0x4aacca72145e1df2aec137e1f3c5e3d75db8b5f3",
      contractName: "AlloV2/Registry/V1",
      fromBlock: 4617051,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 4617314,
    },
    {
      contractName: "AlloV2/AlloV1ToV2ProfileMigration",
      address: "0xCd5AbD09ee34BA604795F7f69413caf20ee0Ab60",
      fromBlock: 5100681,
    },
  ],
};
