import { JSX } from "react";

export interface LiveCodeEditorProps {
  code: string | JSX.Element | (() => JSX.Element);
}
