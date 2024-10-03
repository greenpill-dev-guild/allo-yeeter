import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { ApplicationDetailsWithHook } from "../details";
import { mockApplications } from "../../api/providers/mock";

describe("Round Details", async () => {
  test("render", async () => {
    render(
      <ApplicationDetailsWithHook id="id" roundId="roundId" chainId={10} />,
    );
    const application = mockApplications.data.applications[0];
    const { title } = application.project.metadata;

    expect(await screen.findByText(title)).toBeDefined();
    expect(await screen.findByText("approved")).toBeDefined();

    screen.debug();
  });
});
