import type { Meta, StoryObj } from "@storybook/react";
import { BigNumber } from "@/components/BigNumber";
import { Text } from "@/components/Text";
import { Icon } from "@/components/Icon";
import { IconPlus } from "@/components/Icon/components/icons";
import { IconArrowDownRight } from "@tabler/icons-react";

const meta: Meta<typeof BigNumber> = {
  title: "Data Visualisation/BigNumber",
  component: BigNumber,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => <BigNumber {...props}>69%</BigNumber>,
};
export default meta;

type Story = StoryObj<typeof BigNumber>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  render: (props) => (
    <BigNumber {...props}>
      <Text>69%</Text>
      <Text>Shield integrity</Text>
    </BigNumber>
  ),
};

export const WithIcon: Story = {
  render: (props) => (
    <BigNumber {...props}>
      <IconPlus />
      <Text>69%</Text>
      <Text>Shield integrity</Text>
    </BigNumber>
  ),
};

export const WithIconAfter: Story = {
  render: (props) => (
    <BigNumber {...props}>
      <Text>12</Text>
      <Icon color="danger" aria-label="Decreased">
        <IconArrowDownRight />
      </Icon>
      <Text>Open incidents</Text>
    </BigNumber>
  ),
};
