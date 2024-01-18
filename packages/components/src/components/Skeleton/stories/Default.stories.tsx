import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "../Skeleton";
import React from "react";

const meta: Meta<typeof Skeleton> = {
  title: "Skeleton",
  component: Skeleton,
  render: (props) => <Skeleton {...props} />,
  parameters: {
    controls: { exclude: ["className"] },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  render: (props) => (
    <div
      style={{
        background: "var(--color--navy-blue--800)",
        padding: "var(--size-px--m)",
      }}
    >
      <Skeleton {...props} />
    </div>
  ),
};

export const WithCustomSize: Story = {
  render: (props) => <Skeleton {...props} width="50%" height={100} />,
};
