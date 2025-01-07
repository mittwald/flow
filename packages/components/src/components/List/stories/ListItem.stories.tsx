import type { Meta, StoryObj } from "@storybook/react";
import type List from "../List";
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
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { IconEmail } from "@/components/Icon/components/icons";
import { typedList } from "@/components/List";
import { ProgressBar } from "@/components/ProgressBar";
import { Label } from "@/components/Label";
import { Initials } from "@/components/Initials";

const meta: Meta<typeof List> = {
  ...defaultMeta,
  title: "Structure/List/ListItem",
  argTypes: {
    tile: {
      control: "boolean",
    },
  },
  args: { tile: false },
  render: (props) => {
    const List = typedList<{ name: string }>();

    return (
      <List.List tile={props.tile}>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>
                {user.name} <AlertBadge status="danger">Gesperrt</AlertBadge>
              </Heading>
              <Text>Mittwald</Text>
              <ContextMenu>
                <MenuItem>Show details</MenuItem>
              </ContextMenu>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const WithTopContent: Story = {
  render: (props) => {
    const List = typedList<{ mail: string }>();

    return (
      <List.List tile={props.tile}>
        <List.StaticData data={[{ mail: "john@doe.de" }]} />
        <List.Item textValue={(mail) => mail.mail}>
          {(mail) => (
            <List.ItemView>
              <Avatar>
                <IconEmail />
              </Avatar>
              <Heading>{mail.mail}</Heading>
              <Content>
                <ProgressBar value={50}>
                  <Label>Storage</Label>
                </ProgressBar>
              </Content>
              <ContextMenu>
                <MenuItem>Show details</MenuItem>
              </ContextMenu>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithBottomContent: Story = {
  render: (props) => {
    const List = typedList<{ name: string }>();

    return (
      <List.List tile={props.tile}>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Initials>{user.name}</Initials>
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Content slot="bottom">{dummyText.long}</Content>
              <ContextMenu>
                <MenuItem>Show details</MenuItem>
              </ContextMenu>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithActionGroup: Story = {
  render: (props) => {
    const List = typedList<{ name: string }>();

    return (
      <List.List tile={props.tile}>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <ActionGroup>
                <Button color="secondary" variant="soft" slot="secondary">
                  Edit
                </Button>
                <Button color="danger" variant="soft" slot="secondary">
                  Delete
                </Button>
              </ActionGroup>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithMultipleTexts: Story = {
  render: (props) => {
    const List = typedList<{ name: string }>();

    return (
      <List.List tile={props.tile}>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Text>Development</Text>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};
