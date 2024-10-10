import {
  createSchema as createYeeterRoundSchema,
  CreateAllocationForm as YeeterCreateAllocationForm,
} from "./create-allocation";
import { call as allocateCall } from "./allocate";
import type { StrategyExtension } from "..";

import { getChains } from "@gitcoin/gitcoin-chain-data";

export const yeeter: StrategyExtension = {
  name: "Yeeter",
  type: "yeeter",
  // Deployed strategy contract address for all supported networks
  contracts: getChains()?.reduce(
    // (acc, x) => ({ ...acc, [x.id]: x.contracts.directGrants }),
    // TODO: make this dynamic, as above
    (acc, x) => ({ ...acc, [x.id]: '0x62a814cf94ae73cd3f057c2156d24bb60a5c4884' }),
    {},
  ),
  components: {
    allocate: {
      call: allocateCall,
      createSchema: createYeeterRoundSchema,
      component: YeeterCreateAllocationForm,
    },
  },
};
