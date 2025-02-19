import { Text } from "@/components/Text";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import Button from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Align } from "@/components/Align";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Align> = {
  ...defaultMeta,
  title: "Structure/Align/Text + ContextualHelp",
  component: Align,
  render: (props) => (
    <Align {...props}>
      <Text>Price</Text>

      <ContextualHelpTrigger>
        <Button color="secondary" />

        <ContextualHelp>
          <Heading>Price Information</Heading>
          <Text>This prices are not final and may change.</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Align>
  ),
};
export default meta;

type Story = StoryObj<typeof Align>;

export const Default: Story = {};
