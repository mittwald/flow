import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Heading> = {
  ...defaultMeta,
  title: "Content/Heading/Levels",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1, levelVisual: 1 } };

export const H2: Story = { args: { level: 2, levelVisual: 2 } };

export const H3: Story = { args: { level: 3, levelVisual: 3 } };

export const H4: Story = { args: { level: 4, levelVisual: 4 } };

export const H5: Story = { args: { level: 5, levelVisual: 5 } };

export const H6: Story = { args: { level: 6, levelVisual: 6 } };
