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
  /**
   * Whether the line the cursor is on is highlighted.
   *
   * @default true
   */
  showActiveLineMarker?: boolean;
  /**
   * Whether the gutter offers controls to fold and unfold code blocks.
   *
   * @default true
   */
  showCodeFolding?: boolean;
  /**
   * Whether indentation levels are visualized with guide lines.
   *
   * @default true
   */
  showCodeIndentationMakers?: boolean;
  /**
   * Whether line numbers are shown in the gutter.
   *
   * @default true
   */
  showLineNumbers?: boolean;
  /**
   * Whether linter results are shown in the gutter.
   *
   * @default true
   */
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
    supportedCodeEditorLanguages[language]?.map((loader) =>
      extensions.push(loader()),
    );
  }

  return extensions;
};
