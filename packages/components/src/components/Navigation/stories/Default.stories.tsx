import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { Navigation, NavigationItem } from "@/components/Navigation";

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
      <NavigationItem textValue="Customer">
        <Icon name="customer" />
        <Text>Customer</Text>
      </NavigationItem>
      <NavigationItem textValue="Server" isCurrent>
        <Icon name="server" />
        <Text>Server</Text>
      </NavigationItem>
      <NavigationItem textValue="Project">
        <Icon name="project" />
        <Text>Project</Text>
      </NavigationItem>
    </Navigation>
  ),
};
