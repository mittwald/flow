import { liveCodeEditorGlobalImports } from "@/lib/liveCode/dynamicImports";
import type { FC } from "react";

export const getDynamicComponent = (name: string): unknown => {
  const MissingComponentComplainer: FC<never> = () => {
    throw new Error(
      `Could not find component '${name}'. Run 'yarn build:imports'.`,
    );
  };

  return liveCodeEditorGlobalImports[name] ?? MissingComponentComplainer;
};
