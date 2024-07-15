import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import Icon from "@/components/Icon";
import Text from "@/components/Text";
import Switch from "@/components/Switch";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IconBellRinging } from "@tabler/icons-react";

const meta: Meta<typeof ContextMenu> = {
  title: "Navigation/MenuItem",
  component: ContextMenu,
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem id="item1">Item 1</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  parameters: {
    controls: {
      exclude: ["defaultOpen", "selectionMode", "defaultSelectedKeys"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {};

export const WithIcon: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem id="subscribe">
          <Icon>
            <IconBellRinging />
          </Icon>
          <Text>Subscribe</Text>
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};

export const WithSwitch: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem id="subscribe">
          <Text>Subscribe</Text>
          <Switch isSelected={true} />
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};

export const WithIconAndSwitch: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem id="subscribe">
          <Icon>
            <IconBellRinging />
          </Icon>
          <Text>Subscribe</Text>
          <Switch isSelected={true} />
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
