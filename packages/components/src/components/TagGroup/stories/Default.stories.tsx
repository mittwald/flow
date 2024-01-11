import type { Meta, StoryObj } from "@storybook/react";
import { Tag, TagGroup, TagList } from "../index";
import React from "react";

const meta: Meta<typeof TagGroup> = {
  title: "TagGroup",
  component: TagGroup,
  render: (props) => (
    <TagGroup {...props} aria-label="filter">
      <TagList>
        <Tag id="projects">Projects</Tag>
        <Tag id="servers">Servers</Tag>
        <Tag id="customers">Customers</Tag>
      </TagList>
    </TagGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof TagGroup>;

export const Default: Story = {
  args: { defaultSelectedKeys: ["projects", "servers"] },
};

export const SingleSelect: Story = {
  args: { selectionMode: "single", defaultSelectedKeys: ["projects"] },
};

export const DisabledTags: Story = {
  args: { disabledKeys: ["customers"] },
};
