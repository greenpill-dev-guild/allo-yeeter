import React from "react";
import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "../../test-utils";
import { DiscoverApplications } from "../discover";
import { mockApplications } from "../../api/providers/mock";
import { ApplicationCard } from "../card";

describe("DiscoverApplications", async () => {
  test("render", async () => {
    render(
      <DiscoverApplications
        query={{
          first: 12,
          where: {
            // Get the approved Applications for the round
            roundId: { equalTo: "roundId" },
          },
        }}
        renderItem={(props) => (
          <ApplicationCard
            {...props}
            components={["contributors"]}
            contributors={{
              amount: 10,
              count: 5,
            }}
          />
        )}
      />,
    );

    const application = mockApplications.data.applications[0];
    const { title } = application.project.metadata;

    expect(await screen.findByText(title)).toBeDefined();
  });
});
