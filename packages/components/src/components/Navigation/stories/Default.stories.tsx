import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";
import { Navigation } from "@/components/Navigation";
import { Link } from "@/components/Link";

const meta: Meta<typeof Navigation> = {
  title: "Navigation/Navigation",
  component: Navigation,
  parameters: {
    controls: { exclude: ["className"] },
  },
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  render: (props) => (
    <Navigation aria-label="Companies" {...props}>
      <Link href="https://www.apple.com">Apple</Link>
      <Link href="https://www.mittwald.de" aria-current="page">
        mittwald
      </Link>
      <Link href="https://www.adobe.com">Adobe</Link>
      <Link href="https://www.google.com">Google</Link>
    </Navigation>
  ),
};

export const WithIcons: Story = {
  render: (props) => (
    <Navigation aria-label="Main menu" {...props}>
      <Link>
        <IconCustomer />
        <Text>Customer</Text>
      </Link>
      <Link aria-current="page">
        <IconServer />
        <Text>Server</Text>
      </Link>
      <Link>
        <IconProject />
        <Text>Project</Text>
      </Link>
    </Navigation>
  ),
};
