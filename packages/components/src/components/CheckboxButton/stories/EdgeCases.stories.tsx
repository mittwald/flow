import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxButton } from "../index";
import React from "react";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import Text from "@/components/Text";
import Content from "@/components/Content";
import { ColumnLayout } from "@/components/ColumnLayout";
import { TextField } from "@/components/TextField";
import { FieldDescription } from "@/components/FieldDescription";

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

export const InColumnLayout: Story = {
  render: (props) => (
    <ColumnLayout>
      <CheckboxButton {...props}>
        <Text>{dummyText.short}</Text>
      </CheckboxButton>
      <TextField aria-label={dummyText.short}>
        <FieldDescription>{dummyText.short}</FieldDescription>
      </TextField>
    </ColumnLayout>
  ),
};
