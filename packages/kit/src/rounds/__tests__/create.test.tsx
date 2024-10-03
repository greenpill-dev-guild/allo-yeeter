import React from "react";
import { describe, test } from "vitest";
import { render } from "../../test-utils";
import { CreateRound } from "../create";

describe("CreateRound", async () => {
  test("render", async () => {
    render(<CreateRound onCreated={console.log} />);
  });
});
