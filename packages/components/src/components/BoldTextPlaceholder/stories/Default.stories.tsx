import type { Meta, StoryObj } from "@storybook/react";
import { BoldTextPlaceholder } from "@/components/BoldTextPlaceholder";
import React from "react";

const meta: Meta<typeof BoldTextPlaceholder> = {
  title: "Content/BoldTextPlaceholder",
  component: BoldTextPlaceholder,
  render: (props) => (
    <BoldTextPlaceholder {...props}>Example Text</BoldTextPlaceholder>
  ),
};

export default meta;

type Story = StoryObj<typeof BoldTextPlaceholder>;

export const Default: Story = {};
