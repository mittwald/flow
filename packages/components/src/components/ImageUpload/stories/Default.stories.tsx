import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ImageUpload } from "@/components/ImageUpload";
import CanvasController from "@/components/ImageUpload/CanvasController";
import { Link } from "@/components/Link";
import { Section } from "@/components/Section";

const meta: Meta<typeof ImageUpload> = {
  title: "Upload/ImageUpload",
  component: ImageUpload,
  render: (props) => {
    const canvasController = CanvasController.useNew();
    const url = canvasController.useUrl();

    return (
      <Section>
        <ImageUpload {...props} canvasController={canvasController} />
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
