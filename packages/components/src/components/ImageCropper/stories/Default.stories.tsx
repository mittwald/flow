import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImageCropper } from "@/components/ImageCropper";
import { dummyText } from "@/lib/dev/dummyText";
import { Section } from "@/components/Section";
import { FileField } from "@/components/FileField";
import { Button } from "@/components/Button";
import { Form, SubmitButton, typedField } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { useImageSrc } from "@/lib/hooks/useImageSrc";

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
  render: (props) => {
    const [cropped, setCroppedFile] = useState<File | undefined>(undefined);
    const croppedImageSrc = useImageSrc(cropped);

    return (
      <>
        <Section>
          <ImageCropper
            {...props}
            image={dummyText.imageSrc}
            onCropComplete={setCroppedFile}
          />
        </Section>
        <Section>
          {croppedImageSrc && (
            <img alt="cropped-image-result" src={croppedImageSrc} />
          )}
        </Section>
      </>
    );
  },
};
export default meta;

type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {};

export const WithDownload: Story = {
  render: (props) => {
    const [file, setFile] = useState<FileList | null>(null);
    const [cropped, setCroppedFile] = useState<File | undefined>(undefined);

    const croppedImageSrc = useImageSrc(cropped);

    const downloadCroppedImage = () => {
      if (!cropped) {
        return;
      }

      const a = document.createElement("a");
      a.href = croppedImageSrc;
      a.download = cropped.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return (
      <>
        <Section>
          <FileField
            accept="image/png, image/jpeg, image/svg"
            onChange={setFile}
          >
            <Button variant="outline" color="secondary">
              Select an image
            </Button>
          </FileField>

          {file && (
            <ImageCropper
              {...props}
              image={file?.[0]}
              onCropComplete={setCroppedFile}
            />
          )}
          {croppedImageSrc && (
            <Button onPress={downloadCroppedImage}>Download</Button>
          )}
        </Section>
        <Section>
          {croppedImageSrc && (
            <img alt="cropped-image-result" src={croppedImageSrc} />
          )}
        </Section>
      </>
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
