import type { Meta, StoryObj } from "@storybook/react";
import { Step, StepIndicator } from "../index";
import React from "react";

const meta: Meta<typeof StepIndicator> = {
  title: "Navigation/StepIndicator",
  component: StepIndicator,
  parameters: {
    controls: { exclude: ["current"] },
  },
  render: (props) => (
    <StepIndicator current="payment" {...props}>
      <Step id="configuration">Configuration</Step>
      <Step id="customer">Customer</Step>
      <Step id="payment">Payment</Step>
      <Step id="overview">Overview</Step>
    </StepIndicator>
  ),
};

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const Default: Story = {};

export const SmallSpace: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
