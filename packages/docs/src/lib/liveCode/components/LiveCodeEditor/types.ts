import type { JSX } from "react";

export interface LiveCodeEditorProps {
  code: string | JSX.Element;
  className?: string;
  editorCollapsed?: boolean;
  editorDisabled?: boolean;
  zoom?: number;
  darkBackground?: boolean;
  lightBackground?: boolean;
}
