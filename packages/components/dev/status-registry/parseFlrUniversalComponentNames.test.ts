import { expect, test } from "vitest";
import { parseFlrUniversalComponentNames } from "./parseFlrUniversalComponentNames";

test("collects value identifiers from the named export block, skipping types", () => {
  const source = [
    'export * from "@/components/Icon/components/icons";',
    "",
    "export {",
    "  Action,",
    "  type ActionProps,",
    "  Modal,",
    "  ModalTrigger as ModalOpener,",
    '} from "@/components/public";',
    "",
    'export * from "@/lib/hooks/public";',
  ].join("\n");

  expect(parseFlrUniversalComponentNames(source)).toEqual(
    new Set(["Action", "Modal", "ModalOpener"]),
  );
});

test("returns an empty set when there is no named export block", () => {
  expect(
    parseFlrUniversalComponentNames('export * from "@/components/public";'),
  ).toEqual(new Set());
});
