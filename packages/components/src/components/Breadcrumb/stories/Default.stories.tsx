import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Link } from "@/components/Link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StoryBackground } from "@/lib/dev/StoryBackground";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  render: (props) => (
    <StoryBackground color={props.color}>
      <Breadcrumb {...props}>
        <Link href="#">Project</Link>
        <Link href="#">Apps</Link>
        <Link href="#">App</Link>
      </Breadcrumb>
    </StoryBackground>
  ),
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["default", "dark", "light"],
    },
    size: {
      control: "inline-radio",
      options: ["s", "m"],
    },
  },
  args: { size: "m", color: "default" },
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};
