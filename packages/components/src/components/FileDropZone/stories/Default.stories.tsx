import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileDropZone } from "@/components/FileDropZone";
import { Section } from "@/components/Section";
import { FileCardList } from "@/components/FileCardList";
import { FileCard } from "@/components/FileCard";
import { Form, typedField } from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
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
    controls: { exclude: ["className", "controller", "onChange"] },
  },
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);

    return (
      <Section>
        <FileDropZone {...props} onChange={setFiles}>
          <IconUpload />
          <Heading>Datei ablegen</Heading>
          <FileField name="file" onChange={setFiles}>
            <Button>Datei auswählen</Button>
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
  args: { accept: "image/png" },
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);

    return (
      <Section>
        <FileDropZone {...props} onChange={setFiles}>
          <IconImage />
          <Heading>Bild ablegen</Heading>
          <Text>Erlaubtes Dateiformat ist image/png.</Text>
          <FileField name="file" onChange={setFiles}>
            <Button>Bild auswählen</Button>
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
          <Heading>Dateien ablegen</Heading>
          <FileField name="file" onChange={setFiles}>
            <Button>Dateien auswählen</Button>
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
          <FileDropZone {...props} onChange={(f) => form.setValue("file", f)}>
            <IconUpload />
            <Heading>Datei ablegen</Heading>
            <Field name="file" rules={{ required: "Please choose a file" }}>
              <FileField name="file">
                <Button>Datei auswählen</Button>
              </FileField>
            </Field>
          </FileDropZone>

          <FileCardList>
            {[...(form.watch("file") ?? [])].map((f) => (
              <FileCard name={f.name} key={f.name} />
            ))}
          </FileCardList>
        </Section>
        <ActionGroup>
          <Button type="submit">Upload</Button>
        </ActionGroup>
      </Form>
    );
  },
};
