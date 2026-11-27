import { linter } from "@codemirror/lint";
import type { Extension } from "@uiw/react-codemirror";

/*
 * `@codemirror/lint` does not tell whether a linter is configured. Every
 * `linter()` call returns the same plugin among its extensions, so a linter is
 * configured when that plugin is part of the extensions.
 * `hasLinter.test.ts` fails should a release return it differently.
 */
const lintPlugin = (linter(null) as readonly Extension[])[1];

/* Extensions can refer back to themselves (a plugin's `extension`). */
const containsLintPlugin = (
  extension: Extension,
  seen: Set<Extension>,
): boolean => {
  if (extension === lintPlugin) {
    return true;
  }
  if (seen.has(extension)) {
    return false;
  }
  seen.add(extension);
  if (Array.isArray(extension)) {
    return extension.some((child) => containsLintPlugin(child, seen));
  }
  if (typeof extension !== "object") {
    return false;
  }
  /* `Prec` and `Compartment` wrap their extensions in `inner`. */
  const wrapped = extension as { extension?: Extension; inner?: Extension };
  return [wrapped.extension, wrapped.inner].some(
    (child) => child !== undefined && containsLintPlugin(child, seen),
  );
};

export const hasLinter = (extension: Extension): boolean =>
  containsLintPlugin(extension, new Set());
