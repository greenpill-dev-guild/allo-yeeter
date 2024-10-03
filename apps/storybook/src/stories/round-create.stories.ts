import type { Meta, StoryObj } from "@storybook/react";
import { fn, userEvent, within } from "@storybook/test";
import { CreateRound, strategies } from "@allo-team/kit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Rounds/Create",
  component: CreateRound,
  parameters: {},
  argTypes: {},
  args: {},
} satisfies Meta<typeof CreateRound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCreated: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Round name"), "Round name");
  },
};
