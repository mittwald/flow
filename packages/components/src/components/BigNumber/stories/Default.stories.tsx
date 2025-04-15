import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { BigNumber } from "@/components/BigNumber";
import { Text } from "@/components/Text";

const meta: Meta<typeof BigNumber> = {
  title: "Data Visualisation/BigNumber",
  component: BigNumber,
  render: (props) => <BigNumber {...props}>69%</BigNumber>,
};
export default meta;

type Story = StoryObj<typeof BigNumber>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  render: (props) => (
    <BigNumber {...props}>
      <Text>69%</Text>
      <Text>Performance</Text>
    </BigNumber>
  ),
};
