import { describe, test, expect } from "vitest";
import { mockCreateApplication, renderHook, waitFor } from "../../test-utils";
import {
  useApplications,
  useApplicationById,
  useCreateApplication,
} from "../..";
import { zeroAddress } from "viem";

describe("Application Hooks", async () => {
  test("useApplications", async () => {
    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current?.isPending).toBe(false));

    expect(result.current.data?.length).toBe(12);
  });

  test("useApplicationById", async () => {
    const { result } = renderHook(() =>
      useApplicationById("id", { chainId: 1 }),
    );

    await waitFor(() => expect(result.current?.isPending).toBe(false));

    expect(result.current.data?.name).toBe(
      "Blockravers Q1 - Vitalia + Colorado",
    );
  });

  test("useCreateApplication", async () => {
    const { result } = renderHook(() => useCreateApplication());

    await waitFor(() => expect(result.current?.mutateAsync).toBeDefined());
    const params = {
      roundId: BigInt(1),
      strategyData: "0x",
    } as const;
    await result.current.mutateAsync(params);

    expect(mockCreateApplication).toHaveBeenCalledWith(params, undefined);
  });
});
