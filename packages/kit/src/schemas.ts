import z from "zod";
import { type Address, isAddress } from "viem";

export const EthAddressSchema = z.custom<Address>(
  (val) => isAddress(val as Address),
  "Invalid address",
);
