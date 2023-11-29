import parse from "parse-es-import";
import { getDynamicComponent } from "./getDynamicComponent";
import { ComponentProps } from "react";
import { LiveProvider } from "react-live";

type Scope = ComponentProps<typeof LiveProvider>["scope"];

export const extractEditorScope = (code: string): Scope => {
  const { imports } = parse(code);

  return Object.fromEntries(
    imports.flatMap((i) =>
      [...i.namedImports.map((i) => i.alias), i.defaultImport]
        .filter((i) => i !== "" && i !== "React")
        .map((name) => [name, getDynamicComponent(name)]),
    ),
  );
};
