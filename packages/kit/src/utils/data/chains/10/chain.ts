import { TChain } from "../../../types";
import { daiIcon, ethIcon, opIcon, usdGloIcon } from "../../icons";

export const optimism: TChain = {
  id: 10,
  name: "optimism",
  prettyName: "Optimism",
  type: "mainnet",
  blockExplorer: "https://optimistic.etherscan.io/",
  icon: opIcon,
  coingeckoId: "optimistic-ethereum",
  rpc: "https://optimism-rpc.publicnode.com/",
  pricesFromTimestamp: 1667354777,
  maxGetLogsRange: 0,
  contracts: {
    multiRoundCheckout: "0x15fa08599EB017F89c1712d0Fe76138899FdB9db",
    quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
    directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
    directAllocationPoolId: 58,
    directAllocationStrategyAddress:
      "0x91ad709fe04e214ef53218572d8d8690a8b4fdd0",
  },
  tokens: [
    {
      code: "DAI",
      icon: daiIcon,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 10,
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      },
      permitVersion: "2",
      redstoneTokenId: "DAI",
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
    {
      code: "GIST",
      icon: "",
      address: "0x93a5347036f69bc6f37ed2b59cbcdda927719217",
      decimals: 18,
      voteAmountCap: BigInt("1000000000000000000"),
      canVote: false,
      priceSource: {
        chainId: 10,
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      },
      redstoneTokenId: "GIST",
    },
    {
      code: "ETH",
      icon: ethIcon,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 10,
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
        chainId: 10,
        address: "0x0000000000000000000000000000000000000000",
      },
      redstoneTokenId: "ETH",
    },
    {
      code: "OP",
      icon: opIcon,
      address: "0x4200000000000000000000000000000000000042",
      decimals: 18,
      canVote: true,
      priceSource: {
        chainId: 10,
        address: "0x4200000000000000000000000000000000000042",
      },
      redstoneTokenId: "OP",
    },
  ],
  subscriptions: [
    {
      contractName: "AlloV1/ProjectRegistry/V2",
      address: "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174",
    },
    {
      contractName: "AlloV1/RoundFactory/V2",
      address: "0x04E753cFB8c8D1D7f776f7d7A033740961b6AEC2",
      fromBlock: 87169287,
    },
    {
      contractName: "AlloV1/QuadraticFundingVotingStrategyFactory/V2",
      address: "0x838C5e10dcc1e54d62761d994722367BA167AC22",
      fromBlock: 87168143,
    },
    {
      contractName: "AlloV1/MerklePayoutStrategyFactory/V2",
      address: "0xB5365543cdDa2C795AD104F4cB784EF3DB1CD383",
      fromBlock: 87168143,
    },
    {
      contractName: "AlloV1/DirectPayoutStrategyFactory/V2",
      address: "0x2Bb670C3ffC763b691062d671b386E51Cf1840f0",
      fromBlock: 87168143,
    },
    {
      contractName: "AlloV1/ProgramFactory/V1",
      address: "0xd5Fb00093Ebd30011d932cB69bb6313c550aB05f",
      fromBlock: 87162429,
    },
    {
      contractName: "AlloV2/Registry/V1",
      address: "0x4AAcca72145e1dF2aeC137E1f3C5E3D75DB8b5f3",
      fromBlock: 111678968,
    },
    {
      contractName: "AlloV2/Allo/V1",
      address: "0x1133eA7Af70876e64665ecD07C0A0476d09465a1",
      fromBlock: 111680064,
    },
  ],
};
