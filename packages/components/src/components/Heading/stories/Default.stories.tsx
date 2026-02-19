import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import React from "react";
import { IconMember } from "@/components/Icon/components/icons";
import { Section } from "@/components/Section";

const meta: Meta<typeof Heading> = {
  title: "Content/Heading",
  component: Heading,
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl", "xxl"],
    },
    color: {
      control: "inline-radio",
      options: ["default", "danger", "unavailable", "dark", "light"],
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

export const Dark: Story = {
  args: { color: "dark" },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: { color: "light" },
  globals: {
    backgrounds: "dark",
  },
};

export const Wrap: Story = {
  render: (props) => (
    <Section>
      <Heading {...props}>Personal Information of the current user</Heading>
      <Heading {...props} wrap="balance">
        Personal Information of the current user
      </Heading>
    </Section>
  ),
  parameters: { viewport: { defaultViewport: "mobile2" } },
};
