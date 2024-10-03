import type { Meta, StoryObj } from "@storybook/react";
import { CreateProject } from "@allo-team/kit";
import { application } from "@/data/applications";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Projects/Create",
  component: CreateProject,
  parameters: {
    // layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof CreateProject>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: application.projectId,
    opts: { chainId: application.chainId },
  },
};
