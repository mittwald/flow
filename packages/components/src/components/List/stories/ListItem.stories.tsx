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
import { AlertBadge } from "@/components/AlertBadge";
import { View } from "@/components/List/components/Items/components/Item/components/View";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { IconStar } from "@/components/Icon/components/icons";

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
  decorators: [(story) => <div>{story()}</div>],
  render: () => (
    <View>
      <Avatar>
        <Image alt="John Doe" src={dummyText.imageSrc} />
      </Avatar>
      <Heading>
        John Doe <AlertBadge status="danger">Gesperrt</AlertBadge>
      </Heading>
      <Text>Mittwald</Text>
      <ContextMenu>
        <MenuItem>Show details</MenuItem>
      </ContextMenu>
    </View>
  ),
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const WithTopContent: Story = {
  render: () => (
    <View>
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
    </View>
  ),
};

export const WithContent: Story = {
  render: () => (
    <View>
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
    </View>
  ),
};

export const SmallSpace: Story = {
  render: () => (
    <View>
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
    </View>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const WithActionGroup: Story = {
  render: () => (
    <View>
      <Avatar>
        <Image alt="John Doe" src={dummyText.imageSrc} />
      </Avatar>
      <Heading>John Doe</Heading>
      <Text>Mittwald</Text>
      <ActionGroup>
        <Button color="secondary" variant="soft" slot="secondary">
          <IconStar />
        </Button>
        <ContextMenu>
          <MenuItem>Show details</MenuItem>
        </ContextMenu>
      </ActionGroup>
    </View>
  ),
};

export const WithMultipleTexts: Story = {
  render: () => (
    <View>
      <Avatar>
        <Image alt="John Doe" src={dummyText.imageSrc} />
      </Avatar>
      <Heading>John Doe</Heading>
      <Text>Mittwald</Text>
      <Text>Development</Text>
    </View>
  ),
};
