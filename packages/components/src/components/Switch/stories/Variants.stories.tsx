import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Switch> = {
  ...defaultMeta,
  title: "Switch/Variants",
  args: { defaultSelected: true },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Accent: Story = {};

export const AccentDisabled: Story = { args: { isDisabled: true } };

export const Negative: Story = {
  args: { variant: "negative" },
};

export const NegativeDisabled: Story = {
  args: { variant: "negative", isDisabled: true },
};
