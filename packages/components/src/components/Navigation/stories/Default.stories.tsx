import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Navigation, NavigationGroup } from "@/components/Navigation";
import Label from "@/components/Label";
import { Badge } from "@/components/Badge";
import { CounterBadge } from "@/components/CounterBadge";

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
      <Link>Apple</Link>
      <Link aria-current="page">mittwald</Link>
      <Link>Adobe</Link>
      <Link>Google</Link>
      <Link>
        Domains<Badge>New</Badge>
      </Link>
      <Link>
        Notifications
        <CounterBadge count={3} />
      </Link>
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

export const WithGroups: Story = {
  render: (props) => (
    <Navigation aria-label="Main navigation" {...props}>
      <NavigationGroup collapsable>
        <Label>General</Label>
        <Link>Dashboard</Link>
        <Link aria-current="page">Performance</Link>
      </NavigationGroup>

      <NavigationGroup>
        <Label>General</Label>
        <Link>Apps</Link>
        <Link>Databases</Link>
        <Link>Domains</Link>
      </NavigationGroup>
    </Navigation>
  ),
};
