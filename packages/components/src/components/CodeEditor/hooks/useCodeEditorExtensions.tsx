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
  showActiveLineMarker?: boolean;
  showCodeFolding?: boolean;
  showCodeIndentationMakers?: boolean;
  showLineNumbers?: boolean;
  showLinterMarkers?: boolean;
}

/** @internal */
export const useCodeEditorExtensions = (
  language?: CodeEditorLanguage,
  extensions: Extension[] = [],
  options: CodeEditorSetup = {
    showCodeFolding: true,
    showCodeIndentationMakers: true,
    showLineNumbers: true,
    showLinterMarkers: true,
  },
) => {
  if (options.showLineNumbers) {
    extensions.push(lineNumbers());
  }

  if (options.showCodeFolding) {
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

  if (options.showLinterMarkers) {
    extensions.push(lintGutter());
  }

  if (
    options.showLineNumbers &&
    (!options.showCodeFolding || !options.showLinterMarkers)
  ) {
    extensions.push(gutterSpacer());
  }

  if (options.showCodeIndentationMakers) {
    extensions.push(indentationMarkers());
  }

  if (language) {
    supportedCodeEditorLanguages[language].map((loader) =>
      extensions.push(loader()),
    );
  }

  return extensions;
};
