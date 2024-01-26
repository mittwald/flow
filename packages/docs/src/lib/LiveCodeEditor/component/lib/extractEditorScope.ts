import { getDynamicComponent } from "../../getDynamicComponent";
import { ComponentProps } from "react";
import { LiveProvider } from "react-live";
import { extractRawImports } from "@/lib/LiveCodeEditor/extractImports";

type Scope = ComponentProps<typeof LiveProvider>["scope"];

export const extractEditorScope = (code: string): Scope => {
  const imports = extractRawImports(code);

  return Object.assign(
    {},
    ...imports.flatMap((d) => {
      return d.names.map((i) => {
        return { [i]: getDynamicComponent(`${i}:${d.source as string}`) };
      });
    }),
  );
};
