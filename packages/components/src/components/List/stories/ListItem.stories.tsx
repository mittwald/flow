import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";
import { ListItemContextMenu } from "@/components/List";
import { ContextMenuItem } from "@/components/ContextMenu";
import defaultMeta from "./Default.stories";
import { Item } from "@/components/List/components/Items/components/Item";
import { Avatar } from "@/components/Avatar";
import { IconEmail } from "@/components/Icon/components/icons";

const meta: Meta<typeof List> = {
  ...defaultMeta,
  title: "Structure/List/ListItem",
};

export default meta;

type Story = StoryObj<typeof List>;

export const WithoutAvatar: Story = {
  render: () => (
    <Item>
      <Heading>John Doe</Heading>
      <Text>Mittwald</Text>
      <Content style={{ background: "lightgrey" }}></Content>
      <ListItemContextMenu>
        <ContextMenuItem>Show details</ContextMenuItem>
      </ListItemContextMenu>
    </Item>
  ),
};

export const WithoutSubtitle: Story = {
  render: () => (
    <Item>
      <Heading>John Doe</Heading>
      <Content style={{ background: "lightgrey" }}></Content>
      <ListItemContextMenu>
        <ContextMenuItem>Show details</ContextMenuItem>
      </ListItemContextMenu>
    </Item>
  ),
};

export const WithoutContent: Story = {
  render: () => (
    <Item>
      <Avatar>
        <IconEmail />
      </Avatar>
      <Heading>john@doe.de</Heading>
      <ListItemContextMenu>
        <ContextMenuItem>Show details</ContextMenuItem>
      </ListItemContextMenu>
    </Item>
  ),
};

export const WithoutContextMenu: Story = {
  render: () => (
    <Item>
      <Avatar>
        <IconEmail />
      </Avatar>
      <Heading>john@doe.de</Heading>
      <Content style={{ background: "lightgrey" }}></Content>
    </Item>
  ),
};
