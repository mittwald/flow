import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import React from "react";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Button/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Button>;

export const LongText: Story = {
  render: (props) => <Button {...props}>{dummyText.long}</Button>,
};

export const WithBreak: Story = {
  render: (props) => (
    <Button {...props}>
      Line 1
      <br />
      Line 2
    </Button>
  ),
};

export const WithBreakAndIcon: Story = {
  render: (props) => (
    <Button {...props}>
      <Icon faIcon={faStar} />
      <Text>
        Add to <br /> favorites
      </Text>
    </Button>
  ),
};
