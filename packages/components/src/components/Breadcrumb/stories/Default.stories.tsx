import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem } from "../index";
import React from "react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>Project</BreadcrumbItem>
      <BreadcrumbItem>Apps</BreadcrumbItem>
      <BreadcrumbItem>App</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};
