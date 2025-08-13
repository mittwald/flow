import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import type { Markdown } from "@/components/Markdown";
import { MarkdownEditor } from "@/components/MarkdownEditor";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Form Controls/MarkdownEditor",
  component: MarkdownEditor,
  render: (props) => <MarkdownEditor {...props} />,
};
export default meta;

type Story = StoryObj<typeof Markdown>;

export const Default: Story = {};
