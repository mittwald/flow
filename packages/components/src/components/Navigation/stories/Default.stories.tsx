import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  IconCustomer,
  IconProject,
  IconServer,
} from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";
import {
  Navigation,
  NavigationItem,
  NavigationGroup,
} from "@/components/Navigation";
import Heading from "@/components/Heading";

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
      <NavigationItem href="https://www.apple.com">Apple</NavigationItem>
      <NavigationItem href="https://www.mittwald.de" isCurrent>
        mittwald
      </NavigationItem>
      <NavigationItem href="https://www.adobe.com">Adobe</NavigationItem>
      <NavigationItem href="https://www.google.com">Google</NavigationItem>
    </Navigation>
  ),
};

export const WithIcons: Story = {
  render: (props) => (
    <Navigation aria-label="Main menu" {...props}>
      <NavigationItem>
        <IconCustomer />
        <Text>Customer</Text>
      </NavigationItem>
      <NavigationItem isCurrent>
        <IconServer />
        <Text>Server</Text>
      </NavigationItem>
      <NavigationItem>
        <IconProject />
        <Text>Project</Text>
      </NavigationItem>
    </Navigation>
  ),
};

export const WithGroups: Story = {
  render: (props) => (
    <Navigation aria-label="Main navigation" {...props}>
      <Heading>General</Heading>
      <NavigationGroup>
        <NavigationItem href="#">Dashboard</NavigationItem>
        <NavigationItem href="#" isCurrent>
          Performance
        </NavigationItem>
      </NavigationGroup>
      <Heading>Components</Heading>
      <NavigationGroup>
        <NavigationItem href="#">Apps</NavigationItem>
        <NavigationItem href="#">Databases</NavigationItem>
        <NavigationItem href="#">Domains</NavigationItem>
      </NavigationGroup>
    </Navigation>
  ),
};
