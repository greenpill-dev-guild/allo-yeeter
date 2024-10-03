import type { Meta, StoryObj } from "@storybook/react";
import { ApplicationDetails } from "@allo-team/kit";
import { application } from "@/data/applications";
import { fn } from "@storybook/test";
import { Button } from "@allo-team/kit";
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Applications/Details",
  component: ApplicationDetails,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof ApplicationDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: application.id,
    opts: { chainId: application.chainId, roundId: application.roundId },
  },
};

export const WithAction: Story = {
  args: {
    id: application.id,
    opts: { chainId: application.chainId, roundId: application.roundId },
    action: <Button onClick={() => fn()}>Approve</Button>,
  },
};
