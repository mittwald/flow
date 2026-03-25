import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CodeEditor } from "@/components/CodeEditor";

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
        '        "const foo = () => {\\n" +\n' +
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
    />
  ),
};
export default meta;

type Story = StoryObj<typeof CodeEditor>;

export const Default: Story = {};
