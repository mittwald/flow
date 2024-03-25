import type { Meta, StoryObj } from "@storybook/react";
import { Segment, SegmentedButton } from "../index";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";
import { IconApp } from "@/components/Icon/components/icons";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof SegmentedButton> = {
  title: "Actions/SegmentedButton/Edge Cases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof SegmentedButton>;

export const LongTexts: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="a" aria-label="Label">
      <Segment value="a">
        <IconApp />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.medium}</Content>
      </Segment>
      <Segment value="b">
        <IconApp />
        <Text>{dummyText.medium}</Text>
        <Content>{dummyText.short}</Content>
      </Segment>
      <Segment value="c">
        <IconApp />
        <Text>{dummyText.short}</Text>
        <Content>{dummyText.medium}</Content>
      </Segment>
    </SegmentedButton>
  ),
};

export const MultipleElements: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="0" aria-label="Rating">
      {Array(9)
        .fill("")
        .map((value, index) => (
          <Segment value={index.toString()} key={index}>
            <IconApp />
            <Text>{index + 1} Star</Text>
            <Content>{dummyText.medium}</Content>
          </Segment>
        ))}
    </SegmentedButton>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="0" aria-label="Rating">
      {Array(3)
        .fill("")
        .map((value, index) => (
          <Segment value={index.toString()} key={index}>
            <Text>{index + 1} Star</Text>
          </Segment>
        ))}
    </SegmentedButton>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
