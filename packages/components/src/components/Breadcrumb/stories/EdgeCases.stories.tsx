import type { Meta, StoryObj } from "@storybook/react";
import Breadcrumb from "../index";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { Link } from "@/components/Link";

const meta: Meta<typeof Breadcrumb> = {
  ...defaultMeta,
  title: "Navigation/Breadcrumb/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const LongTexts: Story = {
  render: () => (
    <Breadcrumb>
      <Link>{dummyText.medium}</Link>
      <Link>{dummyText.medium}</Link>
      <Link>{dummyText.medium}</Link>
    </Breadcrumb>
  ),
};
