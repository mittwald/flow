import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileDropZone } from "@/components/FileDropZone";
import { Section } from "@/components/Section";
import { FileCardList } from "@/components/FileCardList";
import { FileCard } from "@/components/FileCard";
import { Form, typedField } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof FileDropZone> = {
  title: "Upload/FileDropZone",
  component: FileDropZone,
  parameters: {
    controls: { exclude: ["className", "controller", "onChange"] },
  },
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);
    return (
      <Section>
        <FileDropZone {...props} onChange={setFiles} />
        <FileCardList>
          {[...(files ?? [])].map((f) => (
            <FileCard name={f.name} key={f.name} />
          ))}
        </FileCardList>
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof FileDropZone>;

const submitAction = action("submit");

export const Default: Story = {};

export const WithAcceptedTypes: Story = { args: { accept: "image/png" } };

export const Multiple: Story = { args: { multiple: true } };

export const WithSize: Story = { args: { size: 10 } };

export const WithReactHookForm: Story = {
  render: (props) => {
    const form = useForm<{
      file: FileList | null;
    }>();

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={submitAction}>
        <Section>
          <Field name="file">
            <FileDropZone
              {...props}
              onChange={(f) => form.setValue("file", f)}
            />
          </Field>
          <FileCardList>
            {[...(form.watch("file") ?? [])].map((f) => (
              <FileCard name={f.name} key={f.name} />
            ))}
          </FileCardList>
        </Section>
      </Form>
    );
  },
};
