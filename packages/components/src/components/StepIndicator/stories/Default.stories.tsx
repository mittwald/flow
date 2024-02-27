import type { Meta, StoryObj } from "@storybook/react";
import { StepIndicator } from "../index";
import React from "react";

const meta: Meta<typeof StepIndicator> = {
  title: "Navigation/Step Indicator",
  component: StepIndicator,
  render: (props) => (
    <StepIndicator
      {...props}
      steps={["Step 1", "Step 2", "Step 3"]}
      current={2}
    />
  ),
};

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const Default: Story = {};
