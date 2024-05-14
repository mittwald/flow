import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Link } from "@/components/Link";
import { Breadcrumb } from "@/components/Breadcrumb";

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
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const StaticBlack: Story = {
  args: { color: "static-black" },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#E0EBFF",
        },
      ],
    },
  },
};

export const StaticWhite: Story = {
  args: { color: "static-white" },
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#002A7B",
        },
      ],
    },
  },
};
