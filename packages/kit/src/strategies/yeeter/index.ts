import {
  createSchema as createYeeterRoundSchema,
  CreateRoundForm as YeeterCreateRoundForm,
} from "./create-round";
import {
  createSchema as createYeeterRegisterSchema,
  RegisterRecipientForm as YeeterRegisterRecipientForm,
} from "./register-recipient";
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
    (acc, x) => ({ ...acc, [x.id]: '0x4352bf4dbd7f9094217d14f46a2bd29cdf8df834' }),
    {},
  ),
  components: {
    createRound: {
      createSchema: createYeeterRoundSchema,
      component: YeeterCreateRoundForm,
    },
    registerRecipient: {
      createSchema: createYeeterRegisterSchema,
      component: YeeterRegisterRecipientForm,
    },
    allocate: {
      call: allocateCall,
    },
  },
};
