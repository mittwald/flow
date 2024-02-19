import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Avatar> = {
  ...defaultMeta,
  title: "Content/Avatar/Variants",
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const SizeXS: Story = { args: { size: "xs" } };

export const SizeS: Story = { args: { size: "s" } };

export const SizeM: Story = { args: { size: "m" } };

export const SizeL: Story = { args: { size: "l" } };
