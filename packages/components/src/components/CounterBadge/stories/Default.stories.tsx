import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CounterBadge } from "@/components/CounterBadge";
import Button from "@/components/Button";
import { IconNotification } from "@/components/Icon/components/icons";

const meta: Meta<typeof CounterBadge> = {
  title: "Status/CounterBadge",
  component: CounterBadge,
  args: { count: 5 },
  parameters: {
    controls: { exclude: ["elementType", "tunnelId", "render"] },
  },
  render: (props) => <CounterBadge {...props} />,
};
export default meta;

type Story = StoryObj<typeof CounterBadge>;

export const Default: Story = {};

export const WithoutContent: Story = {
  args: { count: undefined },
};

export const WithHighNumber: Story = {
  args: { count: 120 },
};

export const WithButton: Story = {
  render: (props) => (
    <Button aria-label={`Notifications: ${props.count}`}>
      <IconNotification />
      <CounterBadge {...props}></CounterBadge>
    </Button>
  ),
};
