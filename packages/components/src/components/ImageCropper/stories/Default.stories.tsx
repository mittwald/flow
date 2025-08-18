import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ImageCropper } from "@/components/ImageCropper";

const meta: Meta<typeof ImageCropper> = {
  title: "Upload/ImageCropper",
  component: ImageCropper,
  render: (props) => {
    return <ImageCropper {...props} />;
  },
};
export default meta;

type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {};
