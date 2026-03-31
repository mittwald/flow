import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Separator } from "@/components/Separator";
import { Text } from "@/components/Text";
import { Flex } from "@/components/Flex";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Separator> = {
  title: "Structure/Separator",
  component: Separator,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  render: (props) => (
    <Flex
      gap="l"
      direction={props.orientation === "horizontal" ? "column" : "row"}
    >
      <Text align="center">{dummyText.medium}</Text>
      <Separator {...props} />
      <Text align="center">{dummyText.medium}</Text>
    </Flex>
  ),
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {};
