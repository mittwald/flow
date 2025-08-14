import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Label } from "@/components/Label";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Form Controls/MarkdownEditor",
  component: MarkdownEditor,
  render: (props) => <MarkdownEditor {...props} />,
};
export default meta;

type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const WithLabel: Story = {
  render: (props) => (
    <MarkdownEditor {...props}>
      <Label>Message</Label>
    </MarkdownEditor>
  ),
};

export const ShowCharacterCount: Story = {
  args: { showCharacterCount: true, maxLength: 100 },
};
