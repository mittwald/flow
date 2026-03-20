import type { Extension } from "@uiw/react-codemirror";
import { lineNumbers } from "@uiw/react-codemirror";
import { lintGutter } from "@codemirror/lint";
import supportedCodeEditorLanguages, {
  type CodeEditorLanguage,
} from "@/components/CodeEditor/languages";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { foldGutter } from "@codemirror/language";

/** @internal */
export interface CodeEditorSetup {
  lineNumbers: boolean;
  foldGutters: boolean;
  lintGutters: boolean;
  indentationMakers: boolean;
}

/** @internal */
export const useCodeEditorExtensions = (
  language?: CodeEditorLanguage,
  extensions: Extension[] = [],
  options: CodeEditorSetup = {
    foldGutters: true,
    indentationMakers: true,
    lineNumbers: true,
    lintGutters: true,
  },
) => {
  if (options.lineNumbers) {
    extensions.push(lineNumbers());
  }

  if (options.lintGutters) {
    extensions.push(lintGutter());
  }

  if (options.foldGutters) {
    extensions.push(
      foldGutter({
        markerDOM: (open) => {
          const element = document.createElement("span");
          element.classList.add("cm-foldGutter");
          element.classList.add(
            open ? "cm-foldGutter-open" : "cm-foldGutter-closed",
          );
          element.innerText = open ? "⌄" : "›";
          return element;
        },
      }),
    );
  }

  if (options.indentationMakers) {
    extensions.push(indentationMarkers());
  }

  if (language) {
    supportedCodeEditorLanguages[language].map((loader) =>
      extensions.push(loader()),
    );
  }

  return extensions;
};
