import type { Meta, StoryObj } from "@storybook/react";
import Alert from "../Alert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Alert> = {
  ...defaultMeta,
  title: "Status/Alert/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const LongTexts: Story = {
  render: (props) => (
    <Alert {...props}>
      <Heading>{dummyText.medium}</Heading>
      <Content>{dummyText.long}</Content>
    </Alert>
  ),
};
