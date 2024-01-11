import type { Meta, StoryObj } from "@storybook/react";
import { Tag, TagGroup, TagList } from "../index";
import React from "react";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dummyText";
import { Radio } from "@/components/RadioGroup";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";

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
