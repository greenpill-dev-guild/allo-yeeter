import {
  createSchema as createDirectGrantsRoundSchema,
  CreateRoundForm as DirectGrantsCreateRoundForm,
} from "./create-round";
import {
  createSchema as createDirectGrantsRegisterSchema,
  RegisterRecipientForm as DirectGrantsRegisterRecipientForm,
} from "./register-recipient";
import { call as reviewRecipientsCall } from "./review-recipients";
import { call as allocateCall } from "./allocate";
import type { StrategyExtension } from "..";

import { getChains } from "../../utils/index";

export const directGrants: StrategyExtension = {
  name: "Direct Grants Lite",
  type: "directGrants",
  // Deployed strategy contract address for all supported networks
  contracts: getChains()?.reduce(
    (acc, x) => ({ ...acc, [x.id]: x.contracts.directGrants }),
    {},
  ),
  components: {
    createRound: {
      createSchema: createDirectGrantsRoundSchema,
      component: DirectGrantsCreateRoundForm,
    },
    registerRecipient: {
      createSchema: createDirectGrantsRegisterSchema,
      component: DirectGrantsRegisterRecipientForm,
    },
    reviewRecipients: {
      call: reviewRecipientsCall,
    },
    allocate: {
      call: allocateCall,
    },
  },
};
