import type { Meta, StoryObj } from "@storybook/react";
import { Tag, TagGroup, TagList } from "../index";
import React from "react";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof TagGroup> = {
  ...defaultMeta,
  title: "TagGroup/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof TagGroup>;

export const MultipleTags: Story = {
  render: (props) => (
    <TagGroup {...props} aria-label="filter">
      <TagList>
        {Array(12)
          .fill("")
          .map((_, index) => (
            <Tag key={index}>{dummyText.short}</Tag>
          ))}
      </TagList>
    </TagGroup>
  ),
};

export const LongText: Story = {
  render: (props) => (
    <TagGroup {...props} aria-label="filter">
      <TagList>
        <Tag>{dummyText.long}</Tag>
      </TagList>
    </TagGroup>
  ),
};
