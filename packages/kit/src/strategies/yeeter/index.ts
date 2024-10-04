import {
  createSchema as createYeeterRoundSchema,
  CreateRoundForm as YeeterCreateRoundForm,
} from "./create-round";
import {
  createSchema as createYeeterRegisterSchema,
  RegisterRecipientForm as YeeterRegisterRecipientForm,
} from "./register-recipient";
import { call as reviewRecipientsCall } from "./review-recipients";
import { call as allocateCall } from "./allocate";
import type { StrategyExtension } from "..";

import { getChains } from "@gitcoin/gitcoin-chain-data";

export const yeeter: StrategyExtension = {
  name: "Yeeter",
  type: "yeeter",
  // Deployed strategy contract address for all supported networks
  contracts: getChains()?.reduce(
    (acc, x) => ({ ...acc, [x.id]: x.contracts.directGrants }),
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
    reviewRecipients: {
      call: reviewRecipientsCall,
    },
    allocate: {
      call: allocateCall,
    },
  },
};
