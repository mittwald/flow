import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FileCardList } from "~/components/FileCardList";
import FileCard from "~/components/FileCard";

const meta: Meta<typeof FileCardList> = {
  title: "Upload/FileCardList",
  component: FileCardList,
  render: (props) => (
    <FileCardList {...props}>
      <FileCard name="file1.txt" />
      <FileCard name="file2.txt" />
      <FileCard name="file3.txt" />
      <FileCard type="image/jpg" name="image.jpg" />
    </FileCardList>
  ),
};
export default meta;

type Story = StoryObj<typeof FileCardList>;

export const Default: Story = {};
