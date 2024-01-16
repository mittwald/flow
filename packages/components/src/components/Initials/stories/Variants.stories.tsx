import type { Meta, StoryObj } from "@storybook/react";
import Initials from "../Initials";
import React from "react";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Initials> = {
  ...defaultMeta,
  title: "Initials/Variants",
};
export default meta;

type Story = StoryObj<typeof Initials>;

export const Variant1: Story = {
  render: (props) => <Initials {...props}>Max Mustermann</Initials>,
};

export const Variant2: Story = {
  render: (props) => <Initials {...props}>Bettina Mustermann</Initials>,
};

export const Variant3: Story = {
  render: (props) => <Initials {...props}>Daniel Mustermann</Initials>,
};

export const Variant4: Story = {
  render: (props) => <Initials {...props}>Karla Mustermann</Initials>,
};
