import type { Meta, StoryObj } from "@storybook/react";
import { StepIndicator } from "../index";
import React from "react";
import defaultStories from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import Step from "@/components/StepIndicator/components/Step";

const meta: Meta<typeof StepIndicator> = {
  ...defaultStories,
  title: "Navigation/StepIndicator/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const LongTexts: Story = {
  render: (props) => (
    <StepIndicator {...props}>
      <Step id="1">{dummyText.medium}</Step>
      <Step id="2">{dummyText.medium}</Step>
      <Step id="3">{dummyText.medium}</Step>
      <Step id="4">{dummyText.medium}</Step>
    </StepIndicator>
  ),
};
