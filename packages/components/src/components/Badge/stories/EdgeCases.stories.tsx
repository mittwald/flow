import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { Text } from "@/components/Text";
import { Label } from "@/components/Label";

const meta: Meta<typeof Badge> = {
  ...defaultMeta,
  title: "Status/Badge/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const LongText: Story = {
  render: (props) => (
    <Badge {...props}>
      <Label>Scope</Label>
      <Text>{dummyText.long}</Text>
    </Badge>
  ),
};
