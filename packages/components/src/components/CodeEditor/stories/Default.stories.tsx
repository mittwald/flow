import type { Meta, StoryObj } from "@storybook/react";
import { CodeEditor } from "@/components/CodeEditor";
import { Label } from "@/components/Label";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { linter, type Diagnostic } from "@codemirror/lint";

const meta: Meta<typeof CodeEditor> = {
  title: "Form Controls/CodeEditor",
  component: CodeEditor,
  args: {
    isDisabled: false,
  },
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

export const WithLinter: Story = {
  render: (props) => (
    <CodeEditor
      language="dotEnv"
      value={
        "# Database\n" +
        "DATABASE_URL=postgres://localhost:5432/app\n" +
        "api_key=secret\n" +
        "DATABASE_URL=postgres://localhost:5432/other\n" +
        "BROKEN LINE\n" +
        "PORT=8080"
      }
      {...props}
    >
      <Label>Environment</Label>
    </CodeEditor>
  ),
};

const severitiesCode =
  'const port = "8080";\n' +
  "var host = 'localhost';\n" +
  "function connect() {\n" +
  "  console.log(host)\n" +
  "  debugger;\n" +
  "}\n";

/**
 * Every severity, a source, an action, two overlapping diagnostics and a
 * diagnostic on a foldable line. It reads the current code, so an applied
 * action removes its diagnostic.
 */
const severitiesLinter = linter(
  (view): Diagnostic[] => {
    const code = view.state.doc.toString();
    const diagnostics: Diagnostic[] = [];

    const report = (
      text: string,
      diagnostic: Omit<Diagnostic, "from" | "to">,
      atEnd = false,
    ) => {
      const from = code.indexOf(text);
      if (from === -1) {
        return;
      }
      const to = from + text.length;
      diagnostics.push({
        ...diagnostic,
        from: atEnd ? to : from,
        to,
      });
    };

    report('"8080"', {
      severity: "info",
      message: "A port is usually a number.",
    });
    report("var ", {
      severity: "warning",
      message: "Use let or const instead of var.",
      source: "eslint(no-var)",
      actions: [
        {
          name: "Replace with let",
          apply: (view, from) =>
            view.dispatch({ changes: { from, to: from + 3, insert: "let" } }),
        },
      ],
    });
    report("'localhost'", {
      severity: "hint",
      message: "Strings use double quotes.",
    });
    report("connect", {
      severity: "warning",
      message: "'connect' is defined but never used.",
      source: "eslint(no-unused-vars)",
    });
    report("console.log(host)", {
      severity: "warning",
      message: "Unexpected console statement.",
      source: "eslint(no-console)",
    });
    if (!code.includes("console.log(host);")) {
      report(
        "console.log(host)",
        { severity: "error", message: "Missing semicolon." },
        true,
      );
    }
    report("debugger", {
      severity: "error",
      message: "Unexpected debugger statement.",
      source: "eslint(no-debugger)",
    });

    return diagnostics;
  },
  { delay: 0 },
);

export const WithLinterSeverities: Story = {
  render: (props) => (
    <CodeEditor
      language="js"
      value={severitiesCode}
      extensions={[severitiesLinter]}
      {...props}
    >
      <Label>Source code</Label>
    </CodeEditor>
  ),
};
