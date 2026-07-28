import { expect, test } from "vitest";
import { parseIntegrationIndexComponentNames } from "./parseIntegrationIndexComponentNames";

test("resolves wildcard, @/components re-export, and named exports", () => {
  const source = [
    'export * from "./components/Link";',
    'export * from "./components/RouterProvider";',
    "export {",
    "  FormSettingsProvider,",
    "  type SubmitInterceptor,",
    '} from "./components/FormSettingsProvider";',
    'export { useFormContext } from "./components/FormContextProvider";',
    'export * from "@/components/PasswordCreationField";',
    'export type * from "@mittwald/password-tools-js/policy";',
    'export { Policy } from "@mittwald/password-tools-js/policy";',
  ].join("\n");

  expect(
    parseIntegrationIndexComponentNames(source, "src/integrations/nextjs"),
  ).toEqual([
    { name: "Link", sourceRoot: "src/integrations/nextjs" },
    { name: "RouterProvider", sourceRoot: "src/integrations/nextjs" },
    { name: "PasswordCreationField", sourceRoot: "src/components" },
    { name: "FormSettingsProvider", sourceRoot: "src/integrations/nextjs" },
    { name: "useFormContext", sourceRoot: "src/integrations/nextjs" },
    { name: "Policy", sourceRoot: "src/integrations/nextjs" },
  ]);
});

test("does not match `export type * from` and dedupes repeats", () => {
  const source = [
    'export type * from "@mittwald/password-tools-js/rules";',
    'export * from "./components/Field";',
    'export * from "./components/Field";',
  ].join("\n");

  expect(
    parseIntegrationIndexComponentNames(
      source,
      "src/integrations/react-hook-form",
    ),
  ).toEqual([
    { name: "Field", sourceRoot: "src/integrations/react-hook-form" },
  ]);
});
