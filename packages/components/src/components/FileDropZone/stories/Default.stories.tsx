import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileDropZone } from "@/components/FileDropZone";
import { Section } from "@/components/Section";
import { FileCardList } from "@/components/FileCardList";
import { FileCard } from "@/components/FileCard";
import { Form, SubmitButton, typedField } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Button } from "@/components/Button";
import { ActionGroup } from "@/components/ActionGroup";
import { IconImage, IconUpload } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";
import { FileField } from "@/components/FileField";
import { Text } from "@/components/Text";

const meta: Meta<typeof FileDropZone> = {
  title: "Upload/FileDropZone",
  component: FileDropZone,
  parameters: {
    controls: { exclude: ["className", "controller", "onChange", "multiple"] },
  },
  args: { isDisabled: false, isReadOnly: false },
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);

    return (
      <Section>
        <FileDropZone {...props} onChange={setFiles}>
          <IconUpload />
          <Heading>Drop file</Heading>
          <FileField name="file" onChange={setFiles}>
            <Button>Select file</Button>
          </FileField>
        </FileDropZone>
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

export const WithAcceptedTypes: Story = {
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);

    return (
      <Section>
        <FileDropZone accept="image/png" {...props} onChange={setFiles}>
          <IconImage />
          <Heading>Drop image</Heading>
          <Text>Only image/png images are allowed.</Text>
          <FileField name="file" onChange={setFiles}>
            <Button>Select image</Button>
          </FileField>
        </FileDropZone>
        <FileCardList>
          {[...(files ?? [])].map((f) => (
            <FileCard name={f.name} key={f.name} />
          ))}
        </FileCardList>
      </Section>
    );
  },
};

export const Multiple: Story = {
  args: { multiple: true },
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);

    return (
      <Section>
        <FileDropZone {...props} onChange={setFiles}>
          <IconUpload />
          <Heading>Drop files</Heading>
          <FileField name="file" onChange={setFiles}>
            <Button>Select files</Button>
          </FileField>
        </FileDropZone>
        <FileCardList>
          {[...(files ?? [])].map((f) => (
            <FileCard name={f.name} key={f.name} />
          ))}
        </FileCardList>
      </Section>
    );
  },
};

export const WithReactHookForm: Story = {
  render: (props) => {
    const form = useForm<{
      file: FileList | null;
    }>();

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={submitAction}>
        <Section>
          <Field name="file" rules={{ required: "Please choose a file" }}>
            <FileDropZone {...props} onChange={(f) => form.setValue("file", f)}>
              <IconUpload />
              <Heading>Drop file</Heading>
              <FileField>
                <Button variant="outline" color="dark">
                  Select file
                </Button>
              </FileField>
            </FileDropZone>
          </Field>
          <FileCardList>
            {[...(form.watch("file") ?? [])].map((f) => (
              <FileCard name={f.name} key={f.name} />
            ))}
          </FileCardList>
        </Section>
        <ActionGroup>
          <SubmitButton>Upload</SubmitButton>
        </ActionGroup>
      </Form>
    );
  },
};
