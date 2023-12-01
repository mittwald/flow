import { ComponentType } from "react";
import { LiveCodeEditorProps } from "@/components/LiveCodeEditor/types";

declare global {
  declare const LiveCodeEditor: ComponentType<LiveCodeEditorProps>;
}
