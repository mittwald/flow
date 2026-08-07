import type { Meta, StoryObj } from "@storybook/react";
import { CodeEditor } from "@/components/CodeEditor";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof CodeEditor> = {
  title: "Form Controls/CodeEditor",
  component: CodeEditor,
  render: (props) => (
    <CodeEditor
      value={
        'import type { Meta, StoryObj } from "@storybook/react";\n' +
        'import React from "react";\n' +
        'import { CodeEditor } from "@/components/CodeEditor";\n' +
        "\n" +
        "const meta: Meta<typeof CodeEditor> = {\n" +
        '  title: "Form Controls/CodeEditor",\n' +
        "  component: CodeEditor,\n" +
        "  render: (props) => (\n" +
        "    <CodeEditor\n" +
        "      value={\n" +
        '        "const jedi = () => {\\n" +\n' +
        '        "}"\n' +
        "      }\n" +
        '      language={"tsx"}\n' +
        "      {...props}\n" +
        "    />\n" +
        "  ),\n" +
        "};\n" +
        "export default meta;\n" +
        "\n" +
        "type Story = StoryObj<typeof CodeEditor>;\n" +
        "\n" +
        "export const Default: Story = {};\n"
      }
      language="tsx"
      {...props}
    >
      <Label>Source code</Label>
    </CodeEditor>
  ),
};
export default meta;

type Story = StoryObj<typeof CodeEditor>;

export const Default: Story = {};

export const WithFieldDescription: Story = {
  render: (props) => (
    <CodeEditor language="json" value={'{ "name": "flow" }'} {...props}>
      <Label>Configuration</Label>
      <FieldDescription>Must be valid JSON</FieldDescription>
    </CodeEditor>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <CodeEditor language="json" value={'{ "name": }'} isInvalid {...props}>
      <Label>Configuration</Label>
      <FieldError>Invalid JSON</FieldError>
    </CodeEditor>
  ),
};

export const WithoutGutters: Story = {
  args: {
    showLineNumbers: false,
    showCodeFolding: false,
    showLinterMarkers: false,
  },
};
