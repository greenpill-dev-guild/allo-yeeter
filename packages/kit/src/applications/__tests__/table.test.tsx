import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { mockApplications } from "../../api/providers/mock";
import { ApplicationsTableWithHook } from "../table";

describe("Round Details", async () => {
  test("render", async () => {
    render(<ApplicationsTableWithHook roundId="roundId" chainId={10} />);
    const application = mockApplications.data.applications[0];
    const { title } = application.project.metadata;

    expect(await screen.findByText(title)).toBeDefined();

    screen.debug();
  });
});
