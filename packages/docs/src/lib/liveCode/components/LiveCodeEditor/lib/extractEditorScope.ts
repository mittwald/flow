import { getDynamicComponent } from "../../../getDynamicComponent";
import { ComponentProps } from "react";
import { LiveProvider } from "@mfalkenberg/react-live-ssr";
import { extractRawImports } from "@/lib/liveCode/extractImports";

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
