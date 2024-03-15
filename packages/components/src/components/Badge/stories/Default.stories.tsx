import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import React from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { IconClose } from "@/components/Icon/components/icons";

const meta: Meta<typeof Badge> = {
  title: "Content/Badge",
  component: Badge,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => <Badge {...props}>Badge</Badge>,
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithButton: Story = {
  render: (props) => (
    <Badge {...props}>
      <Text>Badge</Text>
      <Button>
        <IconClose />
      </Button>
    </Badge>
  ),
};
