import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContextMenu, {
  ContextMenuSection,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import { Separator } from "@/components/Separator";
import { Heading } from "@/components/Heading";
import {
  IconCamera,
  IconEmail,
  IconServer,
} from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";

const meta: Meta<typeof ContextMenu> = {
  title: "Actions/ContextMenu",
  component: ContextMenu,
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem id="item1">Item 1</MenuItem>
        <MenuItem id="item2">Item 2</MenuItem>
        <MenuItem id="item3">Item 3</MenuItem>
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

export const SingleSelection: Story = {
  args: {
    defaultOpen: true,
    selectionMode: "single",
    defaultSelectedKeys: ["item2"],
  },
};

export const MultipleSelection: Story = {
  args: {
    defaultOpen: true,
    selectionMode: "multiple",
    defaultSelectedKeys: ["item2", "item3"],
  },
};

export const WithLinks: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu
        defaultSelectedKeys={["https://www.mittwald.de"]}
        selectionMode="navigation"
        {...props}
      >
        <MenuItem href="https://www.mittwald.de" id="https://www.mittwald.de">
          www.mittwald.de
        </MenuItem>
        <MenuItem href="https://www.google.de">www.google.de</MenuItem>
        <MenuItem href="https://www.adobe.com">www.adobe.com</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  args: {
    defaultOpen: true,
  },
};

export const WithSeparator: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu
        defaultSelectedKeys={["https://www.mittwald.de"]}
        selectionMode="navigation"
        {...props}
      >
        <MenuItem href="https://www.mittwald.de" id="https://www.mittwald.de">
          www.mittwald.de
        </MenuItem>
        <Separator />
        <MenuItem href="https://www.google.de">www.google.de</MenuItem>
        <MenuItem href="https://www.adobe.com">www.adobe.com</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  args: {
    defaultOpen: true,
  },
};

export const WithContextMenuSection: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu selectionMode="navigation" {...props}>
        <ContextMenuSection>
          <Heading>Websites</Heading>
          <MenuItem href="https://www.mittwald.de" id="https://www.mittwald.de">
            www.mittwald.de
          </MenuItem>
          <MenuItem href="https://www.google.de">www.google.de</MenuItem>
          <MenuItem href="https://www.adobe.com">www.adobe.com</MenuItem>
        </ContextMenuSection>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  args: {
    defaultOpen: true,
  },
};

export const WithIcon: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu selectionMode="navigation" {...props}>
        <ContextMenuSection>
          <Heading>Websites</Heading>
          <MenuItem href="https://www.mittwald.de" id="https://www.mittwald.de">
            <IconServer />
            <Text>www.mittwald.de</Text>
          </MenuItem>
          <MenuItem href="https://www.google.de">
            <IconServer />
            <Text>www.google.de</Text>
          </MenuItem>
          <MenuItem isDisabled={true} href="https://www.adobe.com">
            <IconServer />
            <Text>www.adobe.com</Text>
          </MenuItem>
        </ContextMenuSection>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  args: {
    defaultOpen: true,
  },
};

export const CustomWidth: Story = { args: { width: 400 } };

export const WithAvatar: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu selectionMode="navigation" {...props}>
        <ContextMenuSection>
          <MenuItem>
            <Avatar>
              <Initials>Max Mustermann</Initials>
            </Avatar>
            <IconCamera />
          </MenuItem>
          <Heading>Max Mustermann</Heading>
        </ContextMenuSection>
        <Separator />
        <ContextMenuSection>
          <MenuItem>
            <Text>Settings</Text>
          </MenuItem>
          <MenuItem>
            <Text>Logout</Text>
          </MenuItem>
        </ContextMenuSection>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  args: {
    defaultOpen: true,
  },
};

export const WithSectionSelectionMode: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <ContextMenuSection
          selectionMode="switch"
          defaultSelectedKeys={["spamProtection"]}
        >
          <MenuItem id="spamProtection">
            <Text>Spam protection</Text>
          </MenuItem>
        </ContextMenuSection>
        <Separator />

        <ContextMenuSection selectionMode="navigation">
          <MenuItem>
            <IconEmail />
            <Text>Update email address</Text>
          </MenuItem>
        </ContextMenuSection>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  args: {
    defaultOpen: true,
  },
};
