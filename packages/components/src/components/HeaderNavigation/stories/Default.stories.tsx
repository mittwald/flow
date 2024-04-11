import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  IconLogout,
  IconNotification,
  IconSearch,
  IconSettings,
  IconSupport,
} from "@/components/Icon/components/icons";
import { Link } from "@/components/Link";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import Avatar from "@/components/Avatar";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ContextMenu";

const meta: Meta<typeof HeaderNavigation> = {
  title: "Navigation/HeaderNavigation",
  component: HeaderNavigation,
  parameters: {
    controls: { exclude: ["className"] },
  },
};

export default meta;

type Story = StoryObj<typeof HeaderNavigation>;

export const Default: Story = {
  render: (props) => (
    <HeaderNavigation aria-label="Header navigation" {...props}>
      <Link href="#">Getting startet</Link>
      <Link href="#" aria-current="page">
        Components
      </Link>
      <Button>
        <IconSearch />
      </Button>
    </HeaderNavigation>
  ),
};

export const WithContextMenu: Story = {
  render: (props) => (
    <HeaderNavigation aria-label="Header navigation" {...props}>
      <Button>
        <IconSearch />
      </Button>
      <Button>
        <IconSupport />
      </Button>
      <Button>
        <IconNotification />
      </Button>
      <ContextMenuTrigger>
        <Button>
          <Avatar>
            <Image alt="Gopher" src={dummyText.imageSrc} />
          </Avatar>
        </Button>
        <ContextMenu>
          <ContextMenuItem>
            <IconSettings />
            <Text>Profile</Text>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconLogout />
            <Text>Logout</Text>
          </ContextMenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </HeaderNavigation>
  ),
};
