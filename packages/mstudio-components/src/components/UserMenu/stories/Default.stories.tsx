import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import UserMenu from "@/components/UserMenu";
import { MenuItem } from "@mittwald/flow-react-components/MenuItem";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { ContextMenuTrigger } from "@mittwald/flow-react-components/ContextMenu";
import { Button } from "@mittwald/flow-react-components/Button";
import { Text } from "@mittwald/flow-react-components/Text";
import { Section } from "@mittwald/flow-react-components/Section";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Separator } from "@mittwald/flow-react-components/Separator";
import {
  IconLogout,
  IconSettings,
} from "@mittwald/flow-react-components/Icons";

const meta: Meta<typeof UserMenu> = {
  title: "UserMenu",
  component: UserMenu,
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Open user menu</Button>
      <UserMenu {...props}>
        <Section>
          <MenuItem>
            <Avatar>
              <Initials>Max Mustermann</Initials>
            </Avatar>
          </MenuItem>
          <Heading>Max Mustermann</Heading>
        </Section>
        <Separator />
        <Section>
          <MenuItem>
            <IconSettings />
            <Text>Profilverwaltung</Text>
          </MenuItem>
          <MenuItem>
            <IconLogout />
            <Text>Logout</Text>
          </MenuItem>
        </Section>
      </UserMenu>
    </ContextMenuTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {};
