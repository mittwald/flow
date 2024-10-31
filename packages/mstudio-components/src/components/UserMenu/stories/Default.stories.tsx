import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import UserMenu from "@/components/UserMenu";
import { MenuItem } from "@mittwald/flow-react-components/MenuItem";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { ContextMenuTrigger } from "@mittwald/flow-react-components/ContextMenu";
import { Button } from "@mittwald/flow-react-components/Button";

const meta: Meta<typeof UserMenu> = {
  title: "UserMenu",
  component: UserMenu,
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Open user menu</Button>
      <UserMenu {...props}>
        <MenuItem>
          <Avatar>
            <Initials>MaxMustermann</Initials>
          </Avatar>
        </MenuItem>
      </UserMenu>
    </ContextMenuTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {};
