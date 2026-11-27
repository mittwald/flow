import { type Diagnostic, linter } from "@codemirror/lint";
import {
  CodeEditor,
  Label,
} from "@mittwald/flow-react-components";
import { useMemo } from "react";

export default () => {
  const extensions = useMemo(
    () => [
      linter(
        (view) => {
          const code = view.state.doc.toString();
          const diagnostics: Diagnostic[] = [];

          const varIndex = code.indexOf("var ");
          if (varIndex !== -1) {
            diagnostics.push({
              from: varIndex,
              to: varIndex + 3,
              severity: "warning",
              message: "Verwende let oder const statt var.",
              source: "eslint(no-var)",
              actions: [
                {
                  name: "Durch let ersetzen",
                  apply: (view, from, to) =>
                    view.dispatch({
                      changes: { from, to, insert: "let" },
                    }),
                },
              ],
            });
          }

          const log = "console.log(host)";
          const logIndex = code.indexOf(log);
          if (logIndex !== -1) {
            const logEnd = logIndex + log.length;
            diagnostics.push({
              from: logIndex,
              to: logEnd,
              severity: "warning",
              message: "Unerwartete Konsolenausgabe.",
              source: "eslint(no-console)",
            });
            if (code[logEnd] !== ";") {
              diagnostics.push({
                from: logEnd,
                to: logEnd,
                severity: "error",
                message: "Semikolon fehlt.",
              });
            }
          }

          return diagnostics;
        },
        { delay: 0 },
      ),
    ],
    [],
  );

  return (
    <CodeEditor
      language="js"
      extensions={extensions}
      defaultValue={
        'var host = "localhost";\nconsole.log(host)\n'
      }
    >
      <Label>Skript</Label>
    </CodeEditor>
  );
};
