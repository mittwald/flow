import type { Meta, StoryObj } from "@storybook/react";
import InlineAlert from "../InlineAlert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof InlineAlert> = {
  ...defaultMeta,
  title: "Status/InlineAlert/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof InlineAlert>;

export const LongTexts: Story = {
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>{dummyText.medium}</Heading>
      <Content>{dummyText.long}</Content>
    </InlineAlert>
  ),
};
