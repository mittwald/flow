import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Switch> = {
  ...defaultMeta,
  title: "Forms/Switch/Variants",
  args: { defaultSelected: true },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Success: Story = {};

export const SuccessDisabled: Story = { args: { isDisabled: true } };

export const Danger: Story = {
  args: { variant: "danger" },
};

export const DangerDisabled: Story = {
  args: { variant: "danger", isDisabled: true },
};
