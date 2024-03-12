import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import defaultMeta from "./Default.stories";
import { IconMember } from "@/components/Icon/components/icons";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Heading> = {
  ...defaultMeta,
  title: "Content/Heading/Edge Cases",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const LongText: Story = {
  render: (props) => (
    <Heading {...props} level={2}>
      <IconMember />
      {dummyText.medium}
    </Heading>
  ),
};
