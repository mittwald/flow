import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import React from "react";
import { IconCamera, IconPlus } from "@/components/Icon/components/icons";
import { action } from "storybook/actions";
import { Text } from "@/components/Text";
import IconChevronDown from "@/components/Icon/components/icons/IconChevronDown";
import { Avatar } from "@/components/Avatar";
import { Tooltip } from "@/components/Tooltip";
import TooltipTrigger from "@/components/Tooltip/components/TooltipTrigger";
import { dummyText } from "@/lib/dev/dummyText";
import { Image } from "@/components/Image";
import { StoryBackground } from "@/lib/dev/StoryBackground";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  args: {
    onPress: action("onPress"),
    variant: "solid",
    color: "primary",
    size: "m",
    isDisabled: false,
    isReadOnly: false,
    isPending: false,
    isSucceeded: false,
    isFailed: false,
  },
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["primary", "accent", "secondary", "danger", "dark", "light"],
    },
    variant: {
      control: "inline-radio",
      options: ["plain", "solid", "soft", "outline"],
    },
    size: {
      control: "inline-radio",
      options: ["m", "s"],
    },
    isDisabled: {
      control: "boolean",
    },
    isReadOnly: {
      control: "boolean",
    },
    isPending: {
      control: "boolean",
    },
    isSucceeded: {
      control: "boolean",
    },
    isFailed: {
      control: "boolean",
    },
  },
  parameters: {
    controls: { exclude: ["onPress"] },
  },
  render: (props) => (
    <StoryBackground color={props.color}>
      <Button {...props}>Button</Button>
    </StoryBackground>
  ),
};

export default meta;

type Story = StoryObj<typeof Button>;
export const Default: Story = {};

export const WithIcon: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Button {...props} aria-label="Add to favorites">
        <IconPlus />
      </Button>
    </StoryBackground>
  ),
};

export const WithTextAndIcon: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Button {...props}>
        <Text>Add email address</Text>
        <IconChevronDown />
      </Button>
    </StoryBackground>
  ),
};

export const WithAvatar: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <TooltipTrigger>
      <Button {...props}>
        <Avatar size="l">
          <Image alt="Gopher" src={dummyText.imageSrc} />
        </Avatar>
        <IconCamera />
      </Button>
      <Tooltip>Profilbild ändern</Tooltip>
    </TooltipTrigger>
  ),
};
