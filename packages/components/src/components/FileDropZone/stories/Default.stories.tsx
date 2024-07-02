import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FileDropZone } from "@/components/FileDropZone";

const meta: Meta<typeof FileDropZone> = {
  title: "Upload/FileDropZone",
  component: FileDropZone,
  render: (props) => <FileDropZone {...props} />,
};
export default meta;

type Story = StoryObj<typeof FileDropZone>;

export const Default: Story = {};
