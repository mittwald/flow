import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Heading> = {
  ...defaultMeta,
  title: "Heading/Levels",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 1 } };

export const H2: Story = { args: { level: 2 } };

export const H3: Story = { args: { level: 3 } };

export const H4: Story = { args: { level: 4 } };

export const H5: Story = { args: { level: 5 } };

export const H6: Story = { args: { level: 6 } };
