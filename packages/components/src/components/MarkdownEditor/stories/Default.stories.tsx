import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Label } from "@/components/Label";
import { FieldError } from "@/components/FieldError";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Form Controls/MarkdownEditor",
  component: MarkdownEditor,
  args: { placeholder: "Write a message..." },
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

export const WithFieldError: Story = {
  render: (props) => (
    <MarkdownEditor {...props} isInvalid defaultValue="hello">
      <FieldError>Invalid message</FieldError>
    </MarkdownEditor>
  ),
};

export const AutoResizeable: Story = {
  args: { rows: 1, autoResizeMaxRows: 5 },
};

export const Resizeable: Story = {
  args: { allowResize: true },
};

export const HorizontallyResizeable: Story = {
  args: { allowResize: "horizontal" },
};

export const VerticallyResizeable: Story = {
  args: { allowResize: "vertical" },
};

export const VerticallyAndAutoResizeable: Story = {
  args: { allowResize: "vertical", rows: 1, autoResizeMaxRows: 5 },
};

export const WithOnChange: Story = {
  render: (props) => {
    return (
      <MarkdownEditor {...props} onChange={(v) => console.log(v)}>
        <Label>Message</Label>
      </MarkdownEditor>
    );
  },
};

export const WithRef: StoryObj = {
  render: (props) => {
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const handleFocus = () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    };

    return (
      <Section>
        <MarkdownEditor {...props} inputRef={editorRef}>
          <Label>Message</Label>
        </MarkdownEditor>
        <Button type="button" onClick={handleFocus}>
          Set focus
        </Button>
      </Section>
    );
  },
};
