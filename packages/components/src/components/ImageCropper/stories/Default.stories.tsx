import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ImageCropper } from "@/components/ImageCropper";
import { dummyText } from "@/lib/dev/dummyText";
import { Section } from "@/components/Section";
import { FileField } from "@/components/FileField";
import { Button } from "@/components/Button";
import { Form, SubmitButton, typedField } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";

const meta: Meta<typeof ImageCropper> = {
  title: "Upload/ImageCropper",
  component: ImageCropper,
  args: { aspectRatio: 1.5, width: 300, height: 300, cropShape: "rect" },
  argTypes: {
    cropShape: { control: "inline-radio", options: ["rect", "round"] },
    width: { control: "number" },
    height: { control: "number" },
  },
  parameters: { controls: { exclude: ["image", "onCropComplete"] } },
  render: (props) => <ImageCropper {...props} image={dummyText.imageSrc} />,
};
export default meta;

type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {};

export const WithDownload: Story = {
  render: (props) => {
    const [croppedImage, setCroppedImage] = useState<File>();
    const [file, setFile] = useState<FileList | null>(null);

    const downloadCroppedImage = () => {
      if (!croppedImage) {
        return;
      }
      const url = URL.createObjectURL(croppedImage);
      const a = document.createElement("a");
      a.href = url;
      a.download = croppedImage.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <Section>
        <FileField accept="image/png, image/jpeg, image/svg" onChange={setFile}>
          <Button variant="outline" color="secondary">
            Select an image
          </Button>
        </FileField>

        {file && (
          <ImageCropper
            {...props}
            image={file?.[0]}
            onCropComplete={(croppedImage) => setCroppedImage(croppedImage)}
          />
        )}

        {croppedImage && (
          <Button onPress={downloadCroppedImage}>Download</Button>
        )}
      </Section>
    );
  },
};

export const WithForm: Story = {
  render: (props) => {
    const [croppedImage, setCroppedImage] = useState<File>();

    const form = useForm<{
      file: FileList | null;
    }>();

    const Field = typedField(form);

    const file = form.watch("file")?.[0];

    return (
      <Form form={form} onSubmit={() => console.log(croppedImage?.name ?? "")}>
        <Section>
          <Field name="file">
            <FileField accept="image/png, image/jpeg, image/svg">
              <Button variant="outline" color="secondary">
                Select an image
              </Button>
            </FileField>
          </Field>
          {file && (
            <>
              <ImageCropper
                {...props}
                image={form.watch("file")?.[0]}
                onCropComplete={(croppedImage) => setCroppedImage(croppedImage)}
              />
              <SubmitButton>Save</SubmitButton>
            </>
          )}
        </Section>
      </Form>
    );
  },
};
