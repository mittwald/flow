import type { Meta, StoryObj } from "@storybook/react";
import Breadcrumb, { BreadcrumbItem } from "../index";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Breadcrumb> = {
  ...defaultMeta,
  title: "Navigation/Breadcrumb/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const LongTexts: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>{dummyText.medium}</BreadcrumbItem>
      <BreadcrumbItem>{dummyText.medium}</BreadcrumbItem>
      <BreadcrumbItem>{dummyText.medium}</BreadcrumbItem>
    </Breadcrumb>
  ),
};
