import { type Extension, lineNumbers } from "@uiw/react-codemirror";
import { lintGutter } from "@codemirror/lint";
import supportedCodeEditorLanguages, {
  isCodeEditorLanguage,
} from "@/components/CodeEditor/languages";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { foldGutter } from "@codemirror/language";
import { gutterSpacer } from "@/components/CodeEditor/extensions/gutterSpacer";
import { useMemo } from "react";

/*
 * Every slot gets the same color: the library picks between its light and dark
 * one by CodeMirror's dark theme flag, which Flow's theme never sets, and the
 * active block needs no color of its own.
 */
const markerColor = "var(--code-editor--indentation-marker-color)";
const indentationMarkerColors = {
  light: markerColor,
  dark: markerColor,
  activeLight: markerColor,
  activeDark: markerColor,
};

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

const noExtensions: Extension[] = [];

/** @internal */
export const useCodeEditorExtensions = (
  language?: string,
  extensions: Extension[] = noExtensions,
  options: CodeEditorSetup = {
    showCodeFolding: true,
    showCodeIndentationMakers: true,
    showLineNumbers: true,
    showLinterMarkers: true,
  },
): Extension[] => {
  const {
    showCodeFolding,
    showCodeIndentationMakers,
    showLineNumbers,
    showLinterMarkers,
  } = options;

  return useMemo(() => {
    const enabledExtensions = [...extensions];

    if (showLineNumbers) {
      enabledExtensions.push(lineNumbers());
    }

    if (showCodeFolding) {
      enabledExtensions.push(
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

    if (showLinterMarkers) {
      enabledExtensions.push(lintGutter());
    }

    if (showLineNumbers && (!showCodeFolding || !showLinterMarkers)) {
      enabledExtensions.push(gutterSpacer());
    }

    if (showCodeIndentationMakers) {
      enabledExtensions.push(
        indentationMarkers({ colors: indentationMarkerColors }),
      );
    }

    if (language && isCodeEditorLanguage(language)) {
      for (const loader of supportedCodeEditorLanguages[language] ?? []) {
        enabledExtensions.push(loader());
      }
    }

    return enabledExtensions;
  }, [
    language,
    extensions,
    showCodeFolding,
    showCodeIndentationMakers,
    showLineNumbers,
    showLinterMarkers,
  ]);
};
