import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ImageCropper } from "@/components/ImageCropper";
import { dummyText } from "@/lib/dev/dummyText";
import type { Area } from "react-easy-crop";

const meta: Meta<typeof ImageCropper> = {
  title: "Upload/image-cropper",
  component: ImageCropper,
  parameters: {
    controls: { exclude: ["className"] },
  },
  args: { cropShape: "rect" },
  argTypes: {
    cropShape: {
      control: "inline-radio",
      options: ["rect", "round"],
    },
    aspect: {
      control: "number",
    },
  },
  render: (props) => (
    <ImageCropper
      {...props}
      image={dummyText.imageSrc}
      onCropComplete={(croppedArea: Area, croppedAreaPixels: Area) => {
        console.log(croppedArea, croppedAreaPixels);
      }}
    />
  ),
};
export default meta;

type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {};

export const Round: Story = { args: { cropShape: "round" } };

export const CustomAspect: Story = { args: { aspect: 5 / 2 } };
