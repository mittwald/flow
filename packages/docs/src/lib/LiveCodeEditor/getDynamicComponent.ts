import dynamic from "next/dynamic";
import { liveCodeEditorGlobalImports } from "@/lib/LiveCodeEditor/liveCodeEditorGlobalImports";
import { ComponentType } from "react";

export const getDynamicComponent = (name: string): ComponentType => {
  if (!(name in liveCodeEditorGlobalImports)) {
    throw new Error(`Could not find ${name} in generatedImports.`);
  }
  const component = liveCodeEditorGlobalImports[name];
  return dynamic(component, { ssr: false });
};
