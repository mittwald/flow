import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";
import React from "react";
import { IconStar } from "../../Icon/components/icons";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Text> = {
  title: "Content/Text",
  component: Text,
  argTypes: {
    align: { control: "inline-radio", options: ["start", "end", "center"] },
    wrap: { control: "inline-radio", options: ["wrap", "balance", "pretty"] },
    elementType: {
      control: "inline-radio",
      options: ["div", "span", "p"],
    },
  },
  args: { align: "start", elementType: "div" },
  render: (props) => (
    <Text {...props}>
      {dummyText.long}
      <br />
      <br />
      <small>{dummyText.medium}</small>
      <br />
      <br />
      <ul>
        <li>Unordered item</li>
        <li>Unordered item</li>
      </ul>
      <br />
      <ol>
        <li>Ordered item</li>
        <li>Ordered item</li>
      </ol>
    </Text>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

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
