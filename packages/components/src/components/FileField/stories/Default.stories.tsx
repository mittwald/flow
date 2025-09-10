import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Label } from "@/components/Label";
import { FileField } from "@/components/FileField";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { FieldError } from "@/components/FieldError";
import { FieldDescription } from "@/components/FieldDescription";
import { IconPaperclip } from "@tabler/icons-react";
import { Icon } from "@/components/Icon";
import { useForm } from "react-hook-form";
import { Form, typedField } from "@/integrations/react-hook-form";
import { action } from "storybook/actions";
import { ActionGroup } from "@/components/ActionGroup";

const meta: Meta<typeof FileField> = {
  title: "Form Controls/FileField",
  component: FileField,
  render: (props) => (
    <FileField {...props}>
      <Label>Certificate</Label>
      <Button variant="outline" color="secondary">
        Select
      </Button>
    </FileField>
  ),
};

export default meta;

type Story = StoryObj<typeof FileField>;

const submitAction = action("submit");

export const Default: Story = {};

export const ReadOnly: Story = {
  args: { isReadOnly: true },
};

export const WithDescription: Story = {
  render: (props) => (
    <FileField {...props}>
      <Label>Certificate</Label>
      <Button variant="outline" color="secondary">
        Select
      </Button>
      <FieldDescription>Supported formats: .pem, .pfx</FieldDescription>
    </FileField>
  ),
};

export const WithError: Story = {
  render: (props) => (
    <FileField {...props} isInvalid>
      <Label>Certificate</Label>
      <Button variant="outline" color="secondary">
        Select
      </Button>
      <FieldError>File too large</FieldError>
    </FileField>
  ),
};

export const IconButton: Story = {
  render: (props) => (
    <FileField {...props}>
      <Button variant="soft" aria-label="Select certificate">
        <Icon>
          <IconPaperclip />
        </Icon>
      </Button>
    </FileField>
  ),
};

export const WithHandler: Story = {
  render: (props) => {
    const [files, setFiles] = useState<FileList | null>(null);
    const file = files?.[0];

    return (
      <Section>
        <FileField {...props} isInvalid onChange={setFiles}>
          <Label>Certificate</Label>
          <Button variant="outline" color="secondary">
            Select
          </Button>
        </FileField>
        {file?.name}
      </Section>
    );
  },
};

export const WithReactHookForm: Story = {
  render: () => {
    const form = useForm<{
      file: FileList | null;
    }>();

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={submitAction}>
        <Section>
          <Field name="file" rules={{ required: "Please choose a file" }}>
            <FileField multiple>
              <Label>Certificate</Label>
              <Button variant="outline" color="secondary">
                Select
              </Button>
            </FileField>
          </Field>
          {form.watch("file")?.[0]?.name}
          <ActionGroup>
            <Button type="submit">Upload</Button>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};
