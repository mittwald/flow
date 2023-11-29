import { Loader } from "next/dynamic";

export type ComponentImports = { [key: string]: Loader<any> };

export interface LiveCodeEditorProps {
  code: string;
}
