import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Link } from "~/components/Link";
import { Breadcrumb } from "~/components/Breadcrumb";
import {
  storyBackgroundDark,
  storyBackgroundLight,
} from "~/lib/dev/storyBackgrounds";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  render: (props) => (
    <Breadcrumb {...props}>
      <Link href="#">Project</Link>
      <Link href="#">Apps</Link>
      <Link href="#">App</Link>
    </Breadcrumb>
  ),
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["primary", "dark", "light"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const Dark: Story = {
  args: { color: "dark" },
  parameters: { backgrounds: storyBackgroundLight },
};

export const Light: Story = {
  args: { color: "light" },
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};
