import React from "react";
import { describe, expect, test } from "vitest";
import { render, screen } from "../../test-utils";
import { DiscoverProjects } from "../discover";
import { mockProjects } from "../../api/providers/mock";

describe("DiscoverProjects", async () => {
  test("render", async () => {
    render(
      <DiscoverProjects
        query={{
          first: 12,
          where: { chainId: { in: [1] } },
        }}
      />,
    );

    const project = mockProjects.data.projects[0];
    const { title = "" } = project.metadata;

    expect(await screen.findByText(title)).toBeDefined();
  });
});
