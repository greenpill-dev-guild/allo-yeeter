import type { Meta, StoryObj } from "@storybook/react";
import { DiscoverApplications } from "@allo-team/kit";

const meta = {
  title: "Applications/Discover",
  component: DiscoverApplications,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof DiscoverApplications>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: [1, 3],
    query: {
      first: 12,
      where: {
        roundId: { equalTo: "0xf89aad3fad6c3e79ffa3ccc835620fcc7e55f919" },
        status: { equalTo: "APPROVED" },
      },
    },
  },
};
