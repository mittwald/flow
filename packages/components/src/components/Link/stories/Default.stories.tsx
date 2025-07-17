import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import { action } from "storybook/actions";
import React from "react";
import { Text } from "@/components/Text";
import {
  storyBackgroundDark,
  storyBackgroundLight,
} from "@/lib/dev/storyBackgrounds";
import { IconDownload } from "@/components/Icon/components/icons";

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  args: {
    onPress: action("onPress"),
    isDisabled: false,
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
    isDisabled: {
      control: "boolean",
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
      Download invoice
      <IconDownload aria-label="download" />
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

export const ExternalLink: Story = {
  args: { target: "_blank" },
  render: (props) => <Link {...props}>mittwald.de</Link>,
};

export const Download: Story = {
  args: { target: "_blank", download: true },
  render: (props) => <Link {...props}>Download file</Link>,
};
