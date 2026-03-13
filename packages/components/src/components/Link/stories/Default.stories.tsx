import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import { action } from "storybook/actions";
import React from "react";
import { Text } from "@/components/Text";
import { IconDownload } from "@/components/Icon/components/icons";
import { StoryBackground } from "@/lib/dev/StoryBackground";

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  args: {
    onPress: action("onPress"),
    isDisabled: false,
    size: "m",
  },
  render: (props) => (
    <StoryBackground color={props.color}>
      <Link {...props}>Adjust project</Link>
    </StoryBackground>
  ),
  parameters: {
    controls: { exclude: ["onPress"] },
  },
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["default", "dark", "light"],
    },
    isDisabled: {
      control: "boolean",
    },
    size: { control: "inline-radio", options: ["s", "m"] },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Inline: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Text color={props.color}>
        Check our <Link {...props}>onboarding</Link> for more information.
      </Text>
    </StoryBackground>
  ),
};

export const WithIcon: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Link {...props} href="https://mittwald.de">
        Download invoice
        <IconDownload aria-label="download" />
      </Link>
    </StoryBackground>
  ),
};

export const ExternalLink: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Link target="_blank" {...props}>
        mittwald.de
      </Link>
    </StoryBackground>
  ),
};

export const Download: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Link target="_blank" download {...props}>
        Download file
      </Link>
    </StoryBackground>
  ),
};
