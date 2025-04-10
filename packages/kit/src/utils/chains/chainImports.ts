import { mainnet } from "../data/chains/1/chain.js";
import { optimism } from "../data/chains/10/chain.js";
import { lukso } from "../data/chains/42/chain.js";
import { polygon } from "../data/chains/137/chain.js";
import { fantom } from "../data/chains/250/chain.js";
import { zksyncEraTestnet } from "../data/chains/300/chain.js";
import { zkSyncEraMainnet } from "../data/chains/324/chain.js";
import { luksoTestnet } from "../data/chains/4201/chain.js";
import { base } from "../data/chains/8453/chain.js";
import { arbitrum } from "../data/chains/42161/chain.js";
import { celoMainnet } from "../data/chains/42220/chain.js";
import { avalancheFuji } from "../data/chains/43113/chain.js";
import { avalanche } from "../data/chains/43114/chain.js";
import { celoTestnet } from "../data/chains/44787/chain.js";
import { polygonMumbai } from "../data/chains/80001/chain.js";
import { scrollSepolia } from "../data/chains/534351/chain.js";
import { scrollMainnet } from "../data/chains/534352/chain.js";
import { seiDevnet } from "../data/chains/713715/chain.js";
import { seiMainnet } from "../data/chains/1329/chain.js";
import { sepolia } from "../data/chains/11155111/chain.js";
import { metis } from "../data/chains/1088/chain.js";
import { hedera } from "../data/chains/295/chain.js";
// import { optimismSepolia } from "../data/chains/11155420/chain.js";

import { TChain } from "../types.js";
import { gnosis } from "../data/chains/100/chain.js";

const chainImports: { [key: number]: TChain } = {
  1: {
    ...mainnet,
  },
  10: {
    ...optimism,
  },
  42: {
    ...lukso,
  },
  100: {
    ...gnosis,
  },
  137: {
    ...polygon,
  },
  250: {
    ...fantom,
  },
  300: {
    ...zksyncEraTestnet,
  },
  324: {
    ...zkSyncEraMainnet,
  },
  4201: {
    ...luksoTestnet,
  },
  8453: {
    ...base,
  },
  42161: {
    ...arbitrum,
  },
  42220: {
    ...celoMainnet,
  },
  43113: {
    ...avalancheFuji,
  },
  43114: {
    ...avalanche,
  },
  80001: {
    ...polygonMumbai,
  },
  44787: {
    ...celoTestnet,
  },
  534351: {
    ...scrollSepolia,
  },
  534352: {
    ...scrollMainnet,
  },
  713715: {
    ...seiDevnet,
  },
  11155111: {
    ...sepolia,
  },
  1329: {
    ...seiMainnet,
  },
  1088: {
    ...metis,
  },
  295: {
    ...hedera,
  },
};

export default chainImports;
