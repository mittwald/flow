import type { JSX } from "react";

export interface LiveCodeEditorProps {
  code: string | JSX.Element;
  className?: string;
  hideCode?: boolean;
}
