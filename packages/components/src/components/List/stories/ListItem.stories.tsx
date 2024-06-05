import type { Meta, StoryObj } from "@storybook/react";
import type List from "../List";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import defaultMeta from "./Default.stories";
import { Avatar } from "@/components/Avatar";
import { dummyText } from "@/lib/dev/dummyText";
import Image from "@/components/Image";
import { Content } from "@/components/Content";
import { Button } from "@/components/Button";
import { IconCheck } from "@/components/Icon/components/icons";
import { ListItem } from "@/components/List";

const ContentPlaceholder: FC<PropsWithChildren> = (props) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "100%",
      border: "1px dashed purple",
      color: "purple",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      padding: "8px",
    }}
  >
    <Text>{props.children}</Text>
  </div>
);

const meta: Meta<typeof List> = {
  ...defaultMeta,
  title: "Structure/List/ListItem",
  render: () => (
    <div style={{ containerType: "inline-size" }}>
      <ListItem>
        <Avatar>
          <Image alt="John Doe" src={dummyText.imageSrc} />
        </Avatar>
        <Heading>John Doe</Heading>
        <Text>Mittwald</Text>
        <ContextMenu>
          <MenuItem>Show details</MenuItem>
        </ContextMenu>
      </ListItem>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const WithTopContent: Story = {
  render: () => (
    <div style={{ containerType: "inline-size" }}>
      <ListItem>
        <Avatar>
          <Image alt="John Doe" src={dummyText.imageSrc} />
        </Avatar>
        <Heading>John Doe</Heading>
        <Text>Mittwald</Text>
        <Content>
          <ContentPlaceholder>Top content</ContentPlaceholder>
        </Content>
        <ContextMenu>
          <MenuItem>Show details</MenuItem>
        </ContextMenu>
      </ListItem>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div style={{ containerType: "inline-size" }}>
      <ListItem>
        <Avatar>
          <Image alt="John Doe" src={dummyText.imageSrc} />
        </Avatar>
        <Heading>John Doe</Heading>
        <Text>Mittwald</Text>
        <Content slot="top">
          <ContentPlaceholder>Top content</ContentPlaceholder>
        </Content>
        <Content slot="bottom">
          <ContentPlaceholder>Bottom content</ContentPlaceholder>
        </Content>
        <ContextMenu>
          <MenuItem>Show details</MenuItem>
        </ContextMenu>
      </ListItem>
    </div>
  ),
};

export const WithLink: Story = {
  render: () => (
    <div style={{ containerType: "inline-size" }}>
      <ListItem href="#">
        <Avatar>
          <Image alt="John Doe" src={dummyText.imageSrc} />
        </Avatar>
        <Heading>John Doe</Heading>
        <Text>Mittwald</Text>
        <Content slot="top">
          <ContentPlaceholder>Top content</ContentPlaceholder>
        </Content>
        <Content slot="bottom">
          <ContentPlaceholder>Bottom content</ContentPlaceholder>
        </Content>
        <ContextMenu>
          <MenuItem>Show details</MenuItem>
        </ContextMenu>
      </ListItem>
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div style={{ containerType: "inline-size" }}>
      <ListItem>
        <Avatar>
          <Image alt="John Doe" src={dummyText.imageSrc} />
        </Avatar>
        <Heading>John Doe</Heading>
        <Text>Mittwald</Text>
        <Button variant="soft">
          <IconCheck />
        </Button>
      </ListItem>
    </div>
  ),
};

export const SmallSpace: Story = {
  render: () => (
    <div style={{ containerType: "inline-size" }}>
      <ListItem>
        <Avatar>
          <Image alt="John Doe" src={dummyText.imageSrc} />
        </Avatar>
        <Heading>John Doe</Heading>
        <Text>Mittwald</Text>
        <Content slot="top">
          <ContentPlaceholder>Top content</ContentPlaceholder>
        </Content>
        <Content slot="bottom">
          <ContentPlaceholder>Bottom content</ContentPlaceholder>
        </Content>
        <ContextMenu>
          <MenuItem>Show details</MenuItem>
        </ContextMenu>
      </ListItem>
    </div>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
