import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import { action } from "@storybook/addon-actions";
import React from "react";
import { Text } from "@/components/Text";
import { IconExternalLink } from "@/components/Icon/components/icons";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  args: {
    onPress: action("onPress"),
  },
  render: (props) => <Link {...props}>Adjust project</Link>,
  parameters: {
    controls: { exclude: ["onPress"] },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Inline: Story = {
  render: (props) => (
    <Text>
      Check our <Link {...props}>onboarding</Link> for more information.
    </Text>
  ),
};

export const Disabled: Story = { args: { isDisabled: true } };

export const WithIcon: Story = {
  render: (props) => (
    <Link {...props} href="https://mittwald.de">
      mittwald.de
      <IconExternalLink aria-label="external link" />
    </Link>
  ),
};

export const WithSkeleton: Story = {
  render: (props) => (
    <Link {...props}>
      <Skeleton />
    </Link>
  ),
};
