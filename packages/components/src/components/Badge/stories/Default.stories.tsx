import type { Meta, StoryObj } from "@storybook/react";
import Badge, { badgeColors } from "../Badge";
import React from "react";
import { Text } from "@/components/Text";
import { Label } from "@/components/Label";
import { ContextMenu } from "@/components/ContextMenu";
import MenuItem from "@/components/MenuItem";
import { useOverlayController } from "@/lib/controller";
import { StoryBackground } from "@/lib/dev/StoryBackground";

const meta: Meta<typeof Badge> = {
  title: "Status/Badge",
  component: Badge,
  parameters: {
    controls: { exclude: ["className"] },
  },
  args: {
    color: "neutral",
    isDisabled: false,
  },
  argTypes: {
    color: {
      control: "inline-radio",
      options: badgeColors,
    },
  },
  render: (props) => (
    <StoryBackground color={props.color}>
      <Badge {...props}>Value</Badge>
    </StoryBackground>
  ),
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithScope: Story = {
  render: (props) => (
    <Badge {...props}>
      <Label>Scope</Label>
      <Text>Value</Text>
    </Badge>
  ),
};

export const WithOnPress: Story = {
  render: (props) => (
    <Badge
      {...props}
      onPress={() => {
        alert("pressed!");
      }}
    >
      Value
    </Badge>
  ),
};

export const WithOnClose: Story = {
  render: (props) => (
    <Badge
      {...props}
      onClose={() => {
        alert("closed!");
      }}
      onPress={() => {
        alert("pressed!");
      }}
    >
      <Label>Scope</Label>
      <Text>Value</Text>
    </Badge>
  ),
};

export const WithContextMenu: Story = {
  render: (props) => {
    const controller = useOverlayController("ContextMenu");
    const triggerRef = React.useRef(null);

    return (
      <>
        <Badge ref={triggerRef} onPress={controller.open} {...props}>
          <Label>Scope</Label>
          <Text>Value</Text>
        </Badge>
        <ContextMenu controller={controller} triggerRef={triggerRef}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
        </ContextMenu>
      </>
    );
  },
};
