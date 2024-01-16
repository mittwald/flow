import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Avatar> = {
  ...defaultMeta,
  title: "Avatar/Variants",
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const SizeS: Story = {};

export const SizeM: Story = { args: { size: "m" } };

export const SizeL: Story = { args: { size: "l" } };
