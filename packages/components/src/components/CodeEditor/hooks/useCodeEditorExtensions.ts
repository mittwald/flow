import { useMemo } from "react";
import type { Extension } from "@uiw/react-codemirror";
import { lintGutter } from "@codemirror/lint";
import supportedCodeEditorLanguages, {
  type CodeEditorLanguage,
} from "@/components/CodeEditor/languages";

export const useCodeEditorExtensions = (
  language?: CodeEditorLanguage,
  extensions: Extension[] = [],
) => {
  return useMemo(() => {
    let enabledExtensions: Extension[] = [...extensions, lintGutter()];

    if (language) {
      enabledExtensions = [
        ...enabledExtensions,
        ...supportedCodeEditorLanguages[language].map((loader) => loader()),
      ];
    }

    return enabledExtensions;
  }, [language, extensions]);
};
