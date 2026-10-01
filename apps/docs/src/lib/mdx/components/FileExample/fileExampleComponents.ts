import type { ComponentType } from "react";
import Suche from "@/content/templates/bausteine/suche/examples/suche";
import SucheHervorgehoben from "@/content/templates/bausteine/suche/examples/suche-hervorgehoben";

/**
 * The examples `<FileExample>` renders, by the `example` name the MDX refers to
 * them with. They are imported for real so their co-located CSS module resolves
 * through Next – the react-live scope used by `LiveCodeEditor` cannot handle a
 * relative CSS import. Hand-maintained, like `appShellComponents`.
 */
export const fileExampleComponents: Record<string, ComponentType> = {
  suche: Suche,
  "suche-hervorgehoben": SucheHervorgehoben,
};
