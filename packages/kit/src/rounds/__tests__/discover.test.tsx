import React from "react";
import { describe, expect, test } from "vitest";
import { render, screen } from "../../test-utils";
import { DiscoverRounds } from "../discover";
import { mockRounds } from "../../api/providers/mock";

describe("DiscoverRounds", async () => {
  test("render", async () => {
    render(
      <DiscoverRounds
        query={{
          first: 12,
          where: { chainId: { in: [1] } },
        }}
      />,
    );

    const round = mockRounds.data.rounds[0];
    const { name } = round.roundMetadata;

    expect(await screen.findByText(name)).toBeDefined();
  });
});
