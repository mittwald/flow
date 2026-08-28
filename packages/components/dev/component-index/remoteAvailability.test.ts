import { expect, test } from "vitest";
import type { ComponentDoc } from "react-docgen-typescript";
import { remoteAvailabilityOf } from "./remoteAvailability";

const component = (
  displayName: string,
  tags: Record<string, string> = {},
): ComponentDoc =>
  ({
    displayName,
    tags,
    props: {},
    methods: [],
    filePath: "",
  }) as unknown as ComponentDoc;

const UNIVERSAL = new Set(["Modal", "List"]);

test("@flr-generate makes a component remote-capable", () => {
  expect(
    remoteAvailabilityOf(
      component("Button", { "flr-generate": "all" }),
      UNIVERSAL,
      [],
    ),
  ).toStrictEqual({ available: true });
});

test("an flr-universal export is remote-capable without the tag", () => {
  expect(remoteAvailabilityOf(component("Modal"), UNIVERSAL, [])).toStrictEqual(
    {
      available: true,
    },
  );
});

test("a hand-written remote counterpart is remote-capable", () => {
  // Form lives in remote-react-components/src/components, so no tag exists here.
  expect(remoteAvailabilityOf(component("Form"), UNIVERSAL, [])).toStrictEqual({
    available: true,
  });
});

test("anything else is not remote-capable", () => {
  expect(
    remoteAvailabilityOf(component("RouterProvider"), UNIVERSAL, []),
  ).toStrictEqual({ available: false });
});

test("reports the globally excluded props the component actually has", () => {
  expect(
    remoteAvailabilityOf(
      component("Button", { "flr-generate": "all" }),
      UNIVERSAL,
      ["variant", "style", "wrapWith", "onPress"],
    ),
  ).toStrictEqual({
    available: true,
    excludedProps: ["style", "wrapWith"],
  });
});

test("reports a per-component @flr-ignore-props exclusion", () => {
  expect(
    remoteAvailabilityOf(
      component("TunnelEntry", {
        "flr-generate": "all",
        "flr-ignore-props": "target, other",
      }),
      UNIVERSAL,
      ["target", "variant"],
    ),
  ).toStrictEqual({ available: true, excludedProps: ["target"] });
});

test("does not report children and key as missing capabilities", () => {
  // Both are on the global ignore list, but children cross as element children
  // and `key` is React's own — listing them would read as a gap.
  expect(
    remoteAvailabilityOf(
      component("Section", { "flr-generate": "all" }),
      UNIVERSAL,
      ["children", "key", "wrapWith"],
    ),
  ).toStrictEqual({ available: true, excludedProps: ["wrapWith"] });
});

test("omits excludedProps when a remote component drops nothing", () => {
  expect(
    remoteAvailabilityOf(
      component("Flex", { "flr-generate": "all" }),
      UNIVERSAL,
      ["gap", "padding"],
    ),
  ).toStrictEqual({ available: true });
});

test("reports nothing for a component that is not remote-capable", () => {
  expect(
    remoteAvailabilityOf(component("Overlay"), UNIVERSAL, [
      "style",
      "wrapWith",
    ]),
  ).toStrictEqual({ available: false });
});
