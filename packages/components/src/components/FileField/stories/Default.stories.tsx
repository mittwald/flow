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

const meta: Meta<typeof FileField> = {
  title: "Form Controls/FileField",
  component: FileField,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
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

export const Default: Story = {};

export const WithFieldDescription: Story = {
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

export const WithFieldError: Story = {
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
        <FileField {...props} onChange={setFiles}>
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
