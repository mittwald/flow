import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import React from "react";
import { IconMember } from "@/components/Icon/components/icons";

const meta: Meta<typeof Heading> = {
  title: "Content/Heading",
  component: Heading,
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
    },
    levelVisual: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
    },
  },
  args: { level: 2 },
  render: (props) => (
    <Heading {...props}>I am a H{props.level} Heading</Heading>
  ),
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const WithIcon: Story = {
  render: (props) => (
    <Heading {...props}>
      <IconMember />
      Personal Information
    </Heading>
  ),
};

export const WithLevelVisual: Story = {
  render: (props) => (
    <Heading level={4} levelVisual={1} {...props}>
      <IconMember />
      Personal Information
    </Heading>
  ),
};

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
