import React from "react";
import { describe, test } from "vitest";
import { render } from "../../test-utils";
import { CreateProject } from "../create";

describe("CreateProject", async () => {
  test("render", async () => {
    render(<CreateProject onCreated={console.log} />);
  });
});
