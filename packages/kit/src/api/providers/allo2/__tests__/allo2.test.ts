import { beforeEach, describe, expect, test, vi } from "vitest";
import { sepolia } from "viem/chains";

import { allo, getProfileId } from "../";
import { WalletClient, zeroAddress } from "viem";

describe("Allo2 Provider", () => {
  const mockSendTransaction = vi.fn();
  const mockSigner: WalletClient = {
    chain: sepolia,
    account: { address: zeroAddress },
    extend: vi.fn(),
    sendTransaction: mockSendTransaction,
    waitForTransactionReceipt: vi.fn(),
  };
  beforeEach(() => {
    mockSendTransaction.mockReset();
  });
  test("createRound", async () => {
    allo.createRound(
      {
        amount: BigInt(0),
        metadata: {
          protocol: BigInt(1),
          pointer: "ipfs-hash",
        },
        strategy: zeroAddress,
        token: undefined,
        managers: [],
        profileId: getProfileId(zeroAddress),
        initStrategyData: undefined,
      },
      mockSigner,
    );

    expect(mockSigner.sendTransaction).toHaveBeenCalled();
  });
  test("createApplication", async () => {
    allo.createApplication(
      {
        roundId: BigInt(0),
        strategyData: undefined,
      },
      mockSigner,
    );

    expect(mockSigner.sendTransaction).toHaveBeenCalled();
  });
  test("getProfile", async () => {
    expect(await allo.getProfile(mockSigner)).toBe(null);
  });
  test("createProfile", async () => {
    allo.createProfile(
      {
        metadata: { protocol: BigInt(1), pointer: "ipfs-hash" },
        name: "name",
      },
      mockSigner,
    );

    expect(mockSigner.sendTransaction).toHaveBeenCalled();
  });
});
