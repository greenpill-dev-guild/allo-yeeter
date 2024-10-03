import type { Meta, StoryObj } from "@storybook/react";
import { type Round, RoundDetails } from "@allo-team/kit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Rounds/Details",
  component: RoundDetails,
  parameters: {
    // layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof RoundDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

const round = {
  id: "round-id",
  name: "Gitcoin Citizens Round #1: Retroactive funding",
  description: `TThe Gitcoin Grants Citizen Rounds aim to reward people and grassroots projects that have contributed to Gitcoin’s success, specifically by engaging with the wider ecosystem and community. An umbrella term could be ‘Gitcoin Community Engagement’. More specifically, we aim to reward work contributing directly to Gitcoin’s ‘most important things’ and our Purpose and Essential Intents. For example, contributions in the areas of educational content, data analysis and support-oriented initiatives.`,
  strategy: "0x...",
  chainId: 10,
};
export const Default: Story = {
  args: {
    isPending: false,
    error: null,
    data: round as Round,
  },
};
export const Loading: Story = {
  args: {
    isPending: true,
    data: undefined,
  },
};
