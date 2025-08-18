import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ImageCropper } from "@/components/ImageCropper";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import { ColumnLayout } from "@/components/ColumnLayout";

const meta: Meta<typeof ImageCropper> = {
  title: "Upload/ImageCropper",
  component: ImageCropper,
  render: (props) => <ImageCropper {...props} image={dummyText.imageSrc} />,
};
export default meta;

type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {};

export const CustomAspect: Story = { args: { aspect: 16 / 9 } };

export const OnCropComplete: Story = {
  render: (props) => {
    const [croppedImage, setCroppedImage] = useState<string>();

    return (
      <ColumnLayout>
        <ImageCropper
          {...props}
          image={dummyText.imageSrc}
          onCropComplete={(croppedImage) => setCroppedImage(croppedImage)}
        />
        {croppedImage && <Image withBorder src={croppedImage} />}
      </ColumnLayout>
    );
  },
};

/*
  render: (props) => {
    const [croppedImage, setCroppedImage] = useState<string>();
    const [files, setFiles] = useState<FileList | null>(null);
    const file = files?.[0];
    return (
      <Section>
        <FileField
          accept="image/png, image/jpeg, image/svg"
          onChange={setFiles}
        >
          <Button variant="outline" color="secondary">
            Select an image
          </Button>
        </FileField>
        <ColumnLayout>
          <ImageCropper
            {...props}
            image={file}
            onCropComplete={(croppedImage) => setCroppedImage(croppedImage)}
          />
          {croppedImage && <Image withBorder src={croppedImage} />}
        </ColumnLayout>
      </Section>
    );
  },
 */
