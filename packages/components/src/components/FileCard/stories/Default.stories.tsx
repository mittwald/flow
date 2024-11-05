import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FileCard } from "@/components/FileCard";

const meta: Meta<typeof FileCard> = {
  title: "Upload/FileCard",
  component: FileCard,
  args: { name: "image.jpg" },
  render: (props) => <FileCard {...props} />,
};
export default meta;

type Story = StoryObj<typeof FileCard>;

export const Default: Story = {};

export const WithType: Story = { args: { type: "image/png" } };

export const WithSize: Story = { args: { sizeInBytes: 47500 } };

export const WithOnDelete: Story = {
  args: {
    onDelete: () => {
      console.log("deleted");
    },
  },
};
