import type { Meta, StoryObj } from "@storybook/react";
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
    controls: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  render: (props) => (
    <Navigation aria-label="Factions" {...props}>
      <Link>Jedi Order</Link>
      <Link aria-current="page">Rebel Alliance</Link>
      <Link>Galactic Empire</Link>
      <Link>The Mandalorians</Link>
      <Link>
        Bounties<Badge>New</Badge>
      </Link>
      <Link>
        Transmissions
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
        <Label>Command</Label>
        <Link>Command Center</Link>
        <Link aria-current="page">Fleet Status</Link>
      </NavigationGroup>

      <NavigationGroup>
        <Label>Systems</Label>
        <Link>Squadrons</Link>
        <Link>Star Charts</Link>
        <Link>Outposts</Link>
      </NavigationGroup>
    </Navigation>
  ),
};
