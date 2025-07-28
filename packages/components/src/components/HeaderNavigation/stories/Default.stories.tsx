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
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Heading } from "@/components/Heading";

const meta: Meta<typeof HeaderNavigation> = {
  title: "Navigation/HeaderNavigation",
  component: HeaderNavigation,
  parameters: {
    controls: { exclude: ["className"] },
  },
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
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["primary", "dark", "light"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeaderNavigation>;

export const Default: Story = {};

export const WithContextMenu: Story = {
  render: (props) => (
    <HeaderNavigation aria-label="Header navigation" {...props}>
      <Button>
        <IconSearch />
      </Button>
      <Button>
        <IconSupport />
      </Button>
      <ModalTrigger>
        <Button>
          <IconNotification />
        </Button>
        <Modal>
          <Heading>Notifications</Heading>
        </Modal>
      </ModalTrigger>
      <ContextMenuTrigger>
        <Button>
          <Avatar>
            <Image alt="Gopher" src={dummyText.imageSrc} />
          </Avatar>
        </Button>
        <ContextMenu>
          <MenuItem>
            <IconSettings />
            <Text>Profile</Text>
          </MenuItem>
          <MenuItem>
            <IconLogout />
            <Text>Logout</Text>
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </HeaderNavigation>
  ),
};

export const Dark: Story = {
  args: { color: "dark" },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: { color: "light" },
  globals: {
    backgrounds: "dark",
  },
};
