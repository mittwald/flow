import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Avatar> = {
  ...defaultMeta,
  title: "Content/Avatar/Variants",
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const SizeXS: Story = { args: { size: "extraSmall" } };

export const SizeS: Story = { args: { size: "small" } };

export const SizeM: Story = { args: { size: "medium" } };

export const SizeL: Story = { args: { size: "large" } };
