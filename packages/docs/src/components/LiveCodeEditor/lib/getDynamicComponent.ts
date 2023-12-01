import dynamic from "next/dynamic";
import { generatedImports } from "@/lib/generatedImports";
import { ComponentType } from "react";

export const getDynamicComponent = (name: string): ComponentType => {
  if (!(name in generatedImports)) {
    throw new Error(`Could not find ${name} in generatedImports.`);
  }
  const component = generatedImports[name];
  return dynamic(component, { ssr: false });
};
