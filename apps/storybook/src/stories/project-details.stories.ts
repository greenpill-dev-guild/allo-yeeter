import type { Meta, StoryObj } from "@storybook/react";
import { ProjectDetails } from "@allo-team/kit";
import { application } from "@/data/applications";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Projects/Details",
  component: ProjectDetails,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof ProjectDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: application.projectId,
    opts: { chainId: application.chainId },
  },
};
