import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import React from "react";
import { IconStar } from "@/components/Icon/components/icons";
import { Section } from "@/components/Section";
import { StoryBackground } from "@/lib/dev/StoryBackground";
import { dummyText } from "@/lib/dev/dummyText";
import { Badge } from "@/components/Badge";

const meta: Meta<typeof Heading> = {
  title: "Content/Heading",
  component: Heading,
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl", "xxl"],
    },
    color: {
      control: "inline-radio",
      options: ["default", "danger", "unavailable", "dark", "light"],
    },
  },
  args: { level: 2 },
  render: (props) => (
    <StoryBackground color={props.color}>
      <Heading {...props}>I am a H{props.level} Heading</Heading>
    </StoryBackground>
  ),
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const AdditionalContent: Story = {
  render: (props) => (
    <StoryBackground color={props.color}>
      <Heading {...props}>
        <IconStar />
        {dummyText.medium}
        <Badge>Badge</Badge>
      </Heading>
    </StoryBackground>
  ),
};

export const Wrap: Story = {
  render: (props) => (
    <Section>
      <Heading {...props}>{dummyText.medium}</Heading>
      <Heading {...props} wrap="balance">
        {dummyText.medium}
      </Heading>
    </Section>
  ),
};
