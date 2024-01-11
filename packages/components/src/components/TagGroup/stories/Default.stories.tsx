import type { Meta, StoryObj } from "@storybook/react";
import { Tag, TagGroup, TagList } from "../index";
import React from "react";
import { Label } from "@/components/Label";

const meta: Meta<typeof TagGroup> = {
  title: "TagGroup",
  component: TagGroup,
  render: (props) => (
    <TagGroup {...props}>
      <Label>Filter</Label>
      <TagList>
        <Tag>Projects</Tag>
        <Tag>Servers</Tag>
        <Tag>Customers</Tag>
      </TagList>
    </TagGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof TagGroup>;

export const Default: Story = {};

export const SingleSelect: Story = { args: { selectionMode: "single" } };
