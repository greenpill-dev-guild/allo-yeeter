import { describe, test, expect, vi } from "vitest";
import { createSchema } from "../register-recipient";
import { API } from "../../../api/types";
import { decodeAbiParameters, parseAbiParameters, zeroAddress } from "viem";

describe("DirectGrants Strategy - Register Recipient", async () => {
  test("Encodes strategyData", async () => {
    const mockApi = {
      upload: vi.fn().mockResolvedValue("ipfs-hash"),
    } as unknown as API;

    const schema = createSchema(mockApi);

    const recipientAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const metadata = {
      application: { round: "round", recipient: "recipient" },
    };

    const actual =
      "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000009697066732d686173680000000000000000000000000000000000000000000000";

    // It should encode into strategyData
    expect(
      await schema.parseAsync({
        __internal__: { recipientAddress, metadata },
      }),
    ).toEqual(actual);

    expect(mockApi.upload).toHaveBeenCalledWith(metadata);

    // Verify we can decode it to the correct params
    expect(
      decodeAbiParameters(
        parseAbiParameters("address, address, (uint256, string)"),
        actual,
      ),
    ).toEqual([zeroAddress, recipientAddress, [BigInt(1), "ipfs-hash"]]);
  });
});
