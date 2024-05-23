import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CounterLabel } from "@/components/CounterLabel";
import Button from "@/components/Button";
import { IconNotification } from "@/components/Icon/components/icons";

const meta: Meta<typeof CounterLabel> = {
  title: "Status/CounterLabel",
  component: CounterLabel,
  render: (props) => <CounterLabel {...props} count={5} />,
};
export default meta;

type Story = StoryObj<typeof CounterLabel>;

export const Default: Story = {};

export const WithoutContent: Story = {
  render: (props) => <CounterLabel {...props} />,
};

export const WithHighNumber: Story = {
  render: (props) => <CounterLabel {...props} count={120} />,
};

export const WithButton: Story = {
  render: (props) => (
    <Button aria-label="Notifications: 7">
      <IconNotification />
      <CounterLabel {...props} count={7}></CounterLabel>
    </Button>
  ),
};
