import type { Meta, StoryObj } from "@storybook/react";
import { Button, ApplicationsTableWithHook } from "@allo-team/kit";
import { application } from "@/data/applications";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Applications/Table",
  component: ApplicationsTableWithHook,
  parameters: {},
  argTypes: {},
  args: {},
} satisfies Meta<typeof ApplicationsTableWithHook>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roundId: application.roundId,
    chainId: application.chainId,
  },
};
