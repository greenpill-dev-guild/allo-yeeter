import type { Meta, StoryObj } from "@storybook/react";
import { RoundCard } from "@allo-team/kit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Rounds/Card",
  component: RoundCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof RoundCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "0xf89aad3fad6c3e79ffa3ccc835620fcc7e55f919",
    chainId: 10,
    name: "Zuzalu Q1-Events Round",
    description:
      'The goal in 2024 is to scale Zuzalu and create an open vibrant ecosystem, with multiple independent spinoffs that innovate on the original idea. We can carry the torch of Zuzalu 2023, with the experience, learnings and culture from these early days, and bring it to the next level by working with and welcoming top talent from our broader world. This round’s primary objective is to fund spinoff events, referred to as "Zu-events." This initiative is expected to significantly contribute to the fulfillment of Zuzalu\'s mission in the year 2024. A “Zuzalu event” is a long-duration in-person gathering whose goal is to experiment with open frontier digital and social technologies.',
    applications: Array(15)
      .fill(0)
      .map(() => ({ id: "" })),
    matching: {
      amount: 166500000000000000000 as unknown as bigint,
      token: "0x0000000000000000000000000000000000000000",
    },
    strategy: "0x03730c4b1Aaef6025D60Eb6451D37066f1baBCd2",
    phases: {
      applicationsStartTime: "2024-01-15T12:00:00+00:00",
      donationsStartTime: "2024-01-30T12:00:00+00:00",
      donationsEndTime: "2024-02-23T05:00:00+00:00",
      donationsEndTime: "2024-02-23T05:00:00+00:00",
    },
  },
};
