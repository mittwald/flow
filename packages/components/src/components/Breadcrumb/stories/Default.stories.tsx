import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Link } from "@/components/Link";
import { Breadcrumb } from "@/components/Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  render: () => (
    <Breadcrumb>
      <Link href="#">Project</Link>
      <Link href="#">Apps</Link>
      <Link href="#">App</Link>
    </Breadcrumb>
  ),
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};
