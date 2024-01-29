import { liveCodeEditorGlobalImports } from "@/lib/LiveCodeEditor/dynamicImports";
import { ComponentType } from "react";

export const getDynamicComponent = (name: string): ComponentType => {
  if (!(name in liveCodeEditorGlobalImports)) {
    throw new Error(`Could not find ${name} in generatedImports.`);
  }
  return liveCodeEditorGlobalImports[name];
};
