import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ImageUpload,
  useImageUploadController,
} from "@/components/ImageUpload";
import { Section } from "@/components/Section";
import { LabeledValue } from "@/components/LabeledValue";
import { Label } from "@/components/Label";
import { Image } from "@/components/Image";

const meta: Meta<typeof ImageUpload> = {
  title: "Upload/ImageUpload",
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
    const controller = useImageUploadController();
    const url = controller.useUrl();

    return (
      <Section>
        <ImageUpload {...props} controller={controller} />
        {url && (
          <LabeledValue>
            <Label>Ergebnis</Label>
            <Image src={url} style={{ width: "contentWidth" }} />
          </LabeledValue>
        )}
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
