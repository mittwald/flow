import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { dummyText } from "@/lib/dev/dummyText";
import { Color } from "@/components/Color";

const meta: Meta<typeof CodeBlock> = {
  title: "Content/CodeBlock",
  component: CodeBlock,
  parameters: {
    controls: {
      exclude: [
        "code",
        "language",
        "style",
        "customStyle",
        "codeTagProps",
        "useInlineStyles",
        "showInlineLineNumbers",
        "startingLineNumber",
        "lineNumberStyle",
        "lineNumberContainerStyle",
        "wrapLines",
        "wrapLongLines",
        "lineProps",
        "renderer",
        "PreTag",
        "CodeTag",
      ],
    },
  },
  args: { copyable: false, showLineNumbers: false },
  argTypes: {
    color: { control: "inline-radio", options: ["default", "dark", "light"] },
    showLineNumbers: { control: "boolean" },
  },
  render: (props) => (
    <CodeBlock
      language="json"
      {...props}
      code={`{
    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
    "name": "My Project"
}`}
    />
  ),
};
export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {};

export const Dark: Story = {
  args: {
    color: "dark",
    copyable: true,
  },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: {
    color: "light",
    copyable: true,
  },
  globals: {
    backgrounds: "dark",
  },
};

export const WithChildren: Story = {
  render: () => (
    <CodeBlock>
      {dummyText.medium}
      <br />
      <Color color="danger">{dummyText.medium}</Color>
      <br />
      {dummyText.medium}
    </CodeBlock>
  ),
};
