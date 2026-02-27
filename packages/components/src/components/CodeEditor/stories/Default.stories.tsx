import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CodeEditor } from "@/components/CodeEditor";

const meta: Meta<typeof CodeEditor> = {
  title: "Form Controls/CodeEditor",
  component: CodeEditor,
  render: (props) => (
    <CodeEditor
      value={"FOO=bar\nFOO=baz\nBAZ=BAR"}
      language={"dotEnv"}
      {...props}
    />
  ),
};
export default meta;

type Story = StoryObj<typeof CodeEditor>;

export const Default: Story = {};
