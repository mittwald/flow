import { type Extension, lineNumbers } from "@uiw/react-codemirror";
import { lintGutter } from "@codemirror/lint";
import supportedCodeEditorLanguages, {
  type CodeEditorLanguage,
} from "@/components/CodeEditor/languages";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { foldGutter } from "@codemirror/language";
import { gutterSpacer } from "@/components/CodeEditor/extensions/gutterSpacer";

/** @internal */
export interface CodeEditorSetup {
  withLineNumbers?: boolean;
  withCodeFolding?: boolean;
  withLinterMarkers?: boolean;
  withCodeIndentationMakers?: boolean;
}

/** @internal */
export const useCodeEditorExtensions = (
  language?: CodeEditorLanguage,
  extensions: Extension[] = [],
  options: CodeEditorSetup = {
    withCodeFolding: true,
    withCodeIndentationMakers: true,
    withLineNumbers: true,
    withLinterMarkers: true,
  },
) => {
  if (options.withLineNumbers) {
    extensions.push(lineNumbers());
  }

  if (options.withCodeFolding) {
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

  if (options.withLinterMarkers) {
    extensions.push(lintGutter());
  }

  if (
    options.withLineNumbers &&
    (!options.withCodeFolding || !options.withLinterMarkers)
  ) {
    extensions.push(gutterSpacer());
  }

  if (options.withCodeIndentationMakers) {
    extensions.push(indentationMarkers());
  }

  if (language) {
    supportedCodeEditorLanguages[language].map((loader) =>
      extensions.push(loader()),
    );
  }

  return extensions;
};
