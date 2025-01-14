import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxButton } from "../index";
import React from "react";
import defaultMeta from "./Default.stories";
import { dummyText } from "~/lib/dev/dummyText";
import Text from "~/components/Text";
import Content from "~/components/Content";

const meta: Meta<typeof CheckboxButton> = {
  title: "Form Controls/CheckboxButton/Edge Cases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof CheckboxButton>;

export const LongTexts: Story = {
  render: (props) => (
    <CheckboxButton {...props}>
      <Text>{dummyText.long}</Text>
      <Content>{dummyText.long}</Content>
    </CheckboxButton>
  ),
};
