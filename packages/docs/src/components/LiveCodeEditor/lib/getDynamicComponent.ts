import dynamic from "next/dynamic";
import { componentsImports } from "./componentsImports";
import { ComponentType } from "react";

export const getDynamicComponent = (name: string): ComponentType => {
  if (!(name in componentsImports)) {
    throw new Error(
      `Could not find ${name} in componentImports. Update "componentImport.ts" or check the code example.`,
    );
  }
  const component = componentsImports[name as keyof typeof componentsImports];
  return dynamic(component, { ssr: false });
};
