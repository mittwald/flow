import type { Meta, StoryObj } from "@storybook/react";
import { Step, StepIndicator } from "../index";
import React from "react";
import defaultStories from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof StepIndicator> = {
  ...defaultStories,
  title: "Navigation/Step Indicator/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const LongTexts: Story = {
  render: (props) => (
    <StepIndicator
      {...props}
      steps={[dummyText.medium, dummyText.medium, dummyText.medium]}
      current={2}
    />
  ),
};
