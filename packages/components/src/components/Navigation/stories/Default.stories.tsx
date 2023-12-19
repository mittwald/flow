import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHardDrive } from "@fortawesome/free-regular-svg-icons/faHardDrive";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { Navigation, NavigationItem } from "@/components/Navigation";

const meta: Meta<typeof Navigation> = {
  title: "Navigation",
  component: Navigation,
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
      <NavigationItem textValue="Address">
        <Icon faIcon={faStar} />
        <Text>Address</Text>
      </NavigationItem>
      <NavigationItem textValue="Profile" isCurrent>
        <Icon faIcon={faUser} />
        <Text>Profile</Text>
      </NavigationItem>
      <NavigationItem textValue="Storage">
        <Icon faIcon={faHardDrive} />
        <Text>Storage</Text>
      </NavigationItem>
    </Navigation>
  ),
};
