import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { ProjectDetailsWithHook } from "../details";
import { mockProjects } from "../../api/providers/mock";

describe("Project Details", async () => {
  test("render", async () => {
    render(<ProjectDetailsWithHook id="id" chainId={10} />);
    const project = mockProjects.data.projects[0];
    const { title = "" } = project.metadata;

    expect(await screen.findByText(title)).toBeDefined();

    screen.debug();
  });
});
