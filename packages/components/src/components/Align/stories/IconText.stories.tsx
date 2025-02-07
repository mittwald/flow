import React from "react";
import { Align } from "@/components/Align";
import { Text } from "@/components/Text";
import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import { IconDomain } from "@/components/Icon/components/icons";

const meta: Meta<typeof Align> = {
  ...defaultMeta,
  title: "Structure/Align/Icon + Text",
  component: Align,
  render: (props) => (
    <Align {...props}>
      <IconDomain />
      <Text>mail.agenturserver.de</Text>
    </Align>
  ),
};
export default meta;

type Story = StoryObj<typeof Align>;

export const Default: Story = {};
