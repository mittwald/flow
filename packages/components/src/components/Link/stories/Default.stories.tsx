import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import { action } from "@storybook/addon-actions";
import React from "react";
import { Text } from "@/components/Text";
import { IconExternalLink } from "@/components/Icon/components/icons";
import {
  storyBackgroundDark,
  storyBackgroundLight,
} from "@/lib/dev/storyBackgrounds";

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
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["primary", "dark", "light"],
    },
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

export const Dark: Story = {
  args: { color: "dark" },
  parameters: {
    backgrounds: storyBackgroundLight,
  },
};

export const Light: Story = {
  args: { color: "light" },
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};
