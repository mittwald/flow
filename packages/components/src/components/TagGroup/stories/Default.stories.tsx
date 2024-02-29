import type { Meta, StoryObj } from "@storybook/react";
import { Tag, TagGroup } from "../index";
import React from "react";
import { useListData } from "react-stately";

const meta: Meta<typeof TagGroup> = {
  title: "TagGroup",
  component: TagGroup,
  render: (props) => (
    <TagGroup label="Filter" {...props} >
      <Tag>Projects</Tag>
      <Tag>Servers</Tag>
      <Tag>Customers</Tag>
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

export const RemovableTags: Story = {
  render: () => {
    let list = useListData({
      initialItems: [
        { id: 1, name: "Projects" },
        { id: 2, name: "Servers" },
        { id: 3, name: "Customers" },
      ],
    });

    return (
      <TagGroup
        label="Filter"
        items={list.items}
        onRemove={(keys) => list.remove(...keys)}
      >
        {(item) => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
};
