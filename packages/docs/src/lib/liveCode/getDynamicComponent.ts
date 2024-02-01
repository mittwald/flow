import { liveCodeEditorGlobalImports } from "@/lib/liveCode/dynamicImports";
import { ComponentType } from "react";

export const getDynamicComponent = (name: string): ComponentType<never> => {
  if (!(name in liveCodeEditorGlobalImports)) {
    throw new Error(
      `Could not find ${name} in generatedImports. Run 'yarn build:imports'.`,
    );
  }
  return liveCodeEditorGlobalImports[name];
};
