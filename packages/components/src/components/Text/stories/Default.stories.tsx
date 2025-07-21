import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";
import React from "react";
import Section from "@/components/Section";
import { InlineCode } from "@/components/InlineCode";
import { IconStar } from "../../Icon/components/icons";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Text> = {
  title: "Content/Text",
  component: Text,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["span", "p"],
      defaultValue: "span",
    },
  },
  args: {
    elementType: "span",
  },
  render: (props) => (
    <Section>
      <Text {...props}>
        Text is an unstyled component that can be used to display texts. By
        default it renders a span.
      </Text>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const RawText: Story = {
  render: (props) => (
    <Text {...props}>Text without styling parent components</Text>
  ),
};

export const UnorderedList: Story = {
  render: (props) => (
    <Text {...props}>
      Text with unordered list:
      <ul>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
      </ul>
    </Text>
  ),
};

export const OrderedList: Story = {
  render: (props) => (
    <Text {...props}>
      Text with ordered list:
      <ol>
        <li>Item</li>
        <li>Item</li>
        <li>Item</li>
      </ol>
    </Text>
  ),
};

export const SmallText: Story = {
  render: (props) => (
    <Text {...props}>
      <small>Small Text</small>
    </Text>
  ),
};

export const Dark: Story = {
  args: { color: "dark" },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: { color: "light" },
  globals: {
    backgrounds: "dark",
  },
};

export const AlignEnd: Story = { args: { align: "end" } };

export const WrapBalance: Story = {
  render: (props) => (
    <Section>
      <Text>
        <strong>
          Without specified <InlineCode>wrap</InlineCode>:
        </strong>
      </Text>
      <Text {...props} align="center">
        This is a centered text in a small container so the text is wrapped.
      </Text>
      <Text>
        <strong>
          With <InlineCode>wrap: balance</InlineCode>:
        </strong>
      </Text>
      <Text {...props} align="center" wrap="balance">
        This is a centered text in a small container so the text is wrapped.
      </Text>
    </Section>
  ),

  parameters: { viewport: { defaultViewport: "mobile2" } },
};

export const WithIcon: Story = {
  render: (props) => (
    <Text {...props}>
      <IconStar /> {dummyText.medium}
      <small>
        {dummyText.short} <IconStar /> {dummyText.short}
      </small>
    </Text>
  ),
};

export const WithWordBreak: Story = {
  render: (props) => (
    <Text {...props} wordBreak="break-word">
      {dummyText.long.replace(/[^\p{L}\p{N}]/gu, "")}
    </Text>
  ),
};
