import type { Meta, StoryObj } from "@storybook/react";
import Initials from "../Initials";
import React from "react";

const meta: Meta<typeof Initials> = {
  title: "Content/Initials",
  component: Initials,
  render: (props) => <Initials {...props}>Max Mustermann</Initials>,
  parameters: {
    controls: { exclude: ["className"] },
  },
};
export default meta;

type Story = StoryObj<typeof Initials>;

export const Default: Story = {};

export const OneLetter: Story = {
  render: (props) => <Initials {...props}>Max </Initials>,
};
