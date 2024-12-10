import React from "react";
import { Align } from "@/components/Align";
import { Text } from "@/components/Text";
import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import { CopyButton } from "@/components/CopyButton";

const meta: Meta<typeof Align> = {
  ...defaultMeta,
  title: "Structure/Align/Text + CopyButton",
  component: Align,
  render: (props) => (
    <Align {...props}>
      <Text>mail.agenturserver.de</Text>
      <CopyButton text="mail.agenturserver.de" />
    </Align>
  ),
};
export default meta;

type Story = StoryObj<typeof Align>;

export const Default: Story = {};
