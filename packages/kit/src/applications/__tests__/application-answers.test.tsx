import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { ApplicationAnswers } from "../application-answers";

describe("Application Answers", async () => {
  test("render", async () => {
    render(
      <ApplicationAnswers applicationId="id" roundId="roundId" chainId={10} />,
    );

    expect(
      await screen.findByText(
        "Did we make an impact in the community that we visited?",
      ),
    ).toBeDefined();
  });
});
