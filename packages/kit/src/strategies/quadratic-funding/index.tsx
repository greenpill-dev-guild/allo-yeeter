import z from "zod";

import type { StrategyExtension } from "..";
import { getChains } from "@gitcoin/gitcoin-chain-data";

export const quadraticFunding: StrategyExtension = {
  name: "Quadratic Funding",
  type: "quadraticFunding",
  // Deployed strategy contract address for networks
  contracts: getChains()?.reduce(
    (acc, x) => ({ ...acc, [x.id]: x.contracts.quadraticFunding }),
    {},
  ),
  components: {
    createRound: {
      createSchema: () => z.any(),
      component: () => <div>QF Component</div>,
    },
  },
};
