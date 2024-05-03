import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "../Skeleton";
import React from "react";

const meta: Meta<typeof Skeleton> = {
  title: "Content/Skeleton",
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
        background: "var(--color--hosting-blue--1000)",
        padding: "var(--size-px--m)",
      }}
    >
      <Skeleton {...props} />
    </div>
  ),
};

export const WithCustomSize: Story = {
  render: (props) => <Skeleton {...props} style={{ height: "200px" }} />,
};
