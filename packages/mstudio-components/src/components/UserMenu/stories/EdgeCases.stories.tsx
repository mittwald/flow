import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import defaultMeta from "./Default.stories";
import { UserMenu } from "@/components/UserMenu";
import { Section } from "@mittwald/flow-react-components/Section";
import Avatar from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Separator } from "@mittwald/flow-react-components/Separator";
import { Text } from "@mittwald/flow-react-components/Text";
import {
  IconLogout,
  IconSettings,
} from "@mittwald/flow-react-components/Icons";
import { MenuItem } from "@mittwald/flow-react-components/MenuItem";
import { ContextMenuTrigger } from "@mittwald/flow-react-components/ContextMenu";
import { Button } from "@mittwald/flow-react-components/Button";

const meta: Meta<typeof UserMenu> = {
  ...defaultMeta,
  title: "UserMenu/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof UserMenu>;

export const LongUserName: Story = {
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
          <Heading>Max Martin Marco Martina Marta Mathilda Mustermann</Heading>
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
