import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";

const meta: Meta<typeof Badge> = {
  ...defaultMeta,
  title: "Content/Badge/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const LongText: Story = {
  render: (props) => (
    <Badge {...props}>
      <Text>{dummyText.medium}</Text>
      <Button>
        <IconClose />
      </Button>
    </Badge>
  ),
};
