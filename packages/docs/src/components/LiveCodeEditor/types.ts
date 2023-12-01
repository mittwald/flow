import { Loader } from "next/dynamic";
import { JSX } from "react";

// eslint-disable-next-line
type AnyLoader = Loader<any>;
export type ComponentImports = { [key: string]: AnyLoader };

export interface LiveCodeEditorProps {
  code: string | JSX.Element;
}
