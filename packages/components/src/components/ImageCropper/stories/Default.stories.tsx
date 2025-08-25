import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ImageCropper } from "@/components/ImageCropper";
import { dummyText } from "@/lib/dev/dummyText";
import { Section } from "@/components/Section";
import { FileField } from "@/components/FileField";
import { Button } from "@/components/Button";
import { Form, typedField } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";

const meta: Meta<typeof ImageCropper> = {
  title: "Upload/ImageCropper",
  component: ImageCropper,
  render: (props) => <ImageCropper {...props} image={dummyText.imageSrc} />,
};
export default meta;

type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {};

export const CustomAspect: Story = { args: { aspect: 16 / 9 } };

export const CustomDimensions: Story = { args: { width: 400, height: 200 } };

export const RoundShape: Story = { args: { aspect: 1, cropShape: "round" } };

export const WithForm: Story = {
  render: (props) => {
    const [croppedImage, setCroppedImage] = useState<File>();

    const form = useForm<{
      file: FileList | null;
    }>();

    const Field = typedField(form);

    const file = form.watch("file")?.[0];

    return (
      <Form form={form} onSubmit={() => action(croppedImage?.name ?? "")}>
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
              <Button type="submit">Save</Button>
            </>
          )}
        </Section>
      </Form>
    );
  },
};
