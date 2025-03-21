import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { AccentBox } from "@/components/AccentBox";
import { dummyText } from "@/lib/dev/dummyText";
import { Section } from "@/components/Section";
import { Flex } from "@/components/Flex";
import { IconStar } from "@/components/Icon/components/icons";
import { LayoutCard } from "@/components/LayoutCard";

const meta: Meta<typeof AccentBox> = {
  title: "Structure/AccentBox",
  component: AccentBox,
  args: { color: "blue" },
  render: (props) => (
    <AccentBox {...props}>
      <Section>
        <Heading>Heading</Heading>
        <Text>{dummyText.medium}</Text>
        <Link>Link</Link>
      </Section>
    </AccentBox>
  ),
};
export default meta;

type Story = StoryObj<typeof AccentBox>;

export const Default: Story = {};

export const Gradient: Story = {
  args: { color: "gradient" },
  render: (props) => (
    <AccentBox {...props}>
      <Flex align="center">
        <Flex direction="column" grow>
          <Heading size="l">Heading</Heading>
          <Text color="dark">
            <b>{dummyText.short}</b>
          </Text>
        </Flex>
        <Link target="_blank" href="#" color="dark">
          Link
        </Link>
      </Flex>
    </AccentBox>
  ),
};

export const WithIcon: Story = {
  args: { color: "blue" },
  render: (props) => (
    <AccentBox {...props}>
      <IconStar />
      <Section>
        <Heading>Heading</Heading>
        <Text>{dummyText.long}</Text>
        <Link>Link</Link>
      </Section>
    </AccentBox>
  ),
};

export const Green: Story = {
  args: { color: "green" },
  render: (props) => (
    <AccentBox {...props}>
      <IconStar />
      <Section>
        <Heading>Heading</Heading>
        <Text>{dummyText.long}</Text>
        <Link>Link</Link>
      </Section>
    </AccentBox>
  ),
};

export const InLayoutCard: Story = {
  args: { color: "blue" },
  render: (props) => (
    <LayoutCard>
      <AccentBox {...props}>
        <IconStar />
        <Section>
          <Heading>Heading</Heading>
          <Text>{dummyText.long}</Text>
          <Link>Link</Link>
        </Section>
      </AccentBox>
    </LayoutCard>
  ),
};
