import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ImageUpload } from "@/components/ImageUpload";
import ImageUploadController from "@/components/ImageUpload/ImageUploadController";
import { Link } from "@/components/Link";
import { Section } from "@/components/Section";

const meta: Meta<typeof ImageUpload> = {
  title: "Upload/image-upload",
  component: ImageUpload,
  parameters: {
    controls: { exclude: ["className", "controller"] },
  },
  argTypes: {
    cropShape: {
      control: "inline-radio",
      options: ["rect", "round"],
    },
    width: {
      control: "number",
    },
    height: {
      control: "number",
    },
  },
  render: (props) => {
    const controller = ImageUploadController.useNew();
    const url = controller.useUrl();

    return (
      <Section>
        <ImageUpload {...props} controller={controller} />
        <Link href={url} isDisabled={!url} download>
          Download cropped image
        </Link>
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {};

export const RoundCropShape: Story = {
  args: { cropShape: "round" },
};
