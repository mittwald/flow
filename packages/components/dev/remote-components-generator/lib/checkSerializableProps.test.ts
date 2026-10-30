import type { ComponentDoc, PropItemType } from "react-docgen-typescript";
import { describe, expect, test } from "vitest";
import {
  acknowledgedFunctionAlternativeProps,
  acknowledgedValueReturningProps,
  checkSerializableProps,
  obsoleteBaselineEntries,
  rejectedProps,
  type UnserializablePropReport,
} from "./checkSerializableProps";
import { isProp, isSlot } from "./propClassifiers";

/*
 * The type names are the ones react-docgen-typescript actually emits — copied
 * from `dist/assets/doc-properties.json`, not invented. `ReactElement` arrives
 * instantiated, which is why an exact-name comparison missed
 * `Rating.iconFilled` and shipped it as a remote property.
 */
const reactElement =
  "ReactElement<unknown, string | JSXElementConstructor<any>>";
const eventHandler = `AdaptChildReactEventHandler<any, ${reactElement}>`;

const componentDoc = (
  displayName: string,
  props: Record<string, string | PropItemType>,
  tags: Record<string, string> = {},
): ComponentDoc =>
  ({
    displayName,
    description: "",
    tags,
    props: Object.fromEntries(
      Object.entries(props).map(([name, type]) => [
        name,
        {
          name,
          required: false,
          description: "",
          type: typeof type === "string" ? { name: type } : type,
        },
      ]),
    ),
  }) as unknown as ComponentDoc;

describe("isSlot", () => {
  test("treats rendered output as a slot, however it is spelled", () => {
    const component = componentDoc("Example", {
      node: "ReactNode",
      element: reactElement,
      bare: "ReactElement",
    });

    expect(isSlot(component, "node")).toBe(true);
    expect(isSlot(component, "element")).toBe(true);
    expect(isSlot(component, "bare")).toBe(true);
  });

  /*
   * Every event prop is typed `AdaptChild*EventHandler<any, ReactElement<…>>`.
   * An unanchored `ReactElement` match turns all ~145 of them into slots, which
   * is why the match is anchored to the start of the type name.
   */
  test("does not mistake an event handler for a slot", () => {
    const component = componentDoc("Example", { onClick: eventHandler });

    expect(isSlot(component, "onClick")).toBe(false);
    expect(isProp(component, "onClick")).toBe(false);
  });

  test("honours the @flr-slot-props tag for types it cannot recognise", () => {
    const component = componentDoc(
      "Example",
      { custom: "SomeOpaqueType" },
      { "flr-slot-props": "custom" },
    );

    expect(isSlot(component, "custom")).toBe(true);
  });
});

describe("checkSerializableProps", () => {
  /*
   * Whether a prop is a function is not read from its name — see
   * `callableReturn.test.ts` for the types behind `callableReturn`.
   */
  test("reports a function that hands rendered output back to the host", () => {
    const type = {
      name: "((props: TableBodyRenderProps) => ReactNode)",
      callableReturn: "rendered-output" as const,
    };
    const reports = checkSerializableProps([
      componentDoc("TableBody", { renderEmptyState: type }),
    ]);

    expect(reports).toStrictEqual([
      {
        component: "TableBody",
        prop: "renderEmptyState",
        type: type.name,
        reason: "returns-rendered-output",
      },
    ]);
  });

  test("stays quiet about props that are slots or events", () => {
    const reports = checkSerializableProps([
      componentDoc("Example", {
        // a slot, so it never becomes a remote property
        emptyView: "ReactNode",
        iconFilled: reactElement,
        // an event, likewise
        onClick: eventHandler,
        // ordinary data
        size: "string",
        rows: "number[]",
      }),
    ]);

    expect(reports).toStrictEqual([]);
  });

  test("stays quiet about a prop removed via @flr-ignore-props", () => {
    /*
     * The generator deletes those props before this check runs, which is what
     * makes the tag a valid escape hatch. Modelled here by leaving it out.
     */
    const reports = checkSerializableProps([componentDoc("Example", {})]);

    expect(reports).toStrictEqual([]);
  });

  /*
   * The `XAxis.tickFormatter` shape: a function property the host calls and
   * reads the result of. It crosses as a thread proxy, so the host gets a
   * Promise and recharts rendered `[object Promise]` into every tick.
   */
  test("reports a function whose return value the host reads", () => {
    const type = {
      name: "((value: unknown, index: number) => string)",
      callableReturn: "value" as const,
    };
    const reports = checkSerializableProps([
      componentDoc("XAxis", { tickFormatter: type }),
    ]);

    expect(reports).toStrictEqual([
      {
        component: "XAxis",
        prop: "tickFormatter",
        type: type.name,
        reason: "returns-a-value",
      },
    ]);
  });

  test("stays quiet about functions whose return value nobody reads", () => {
    const reports = checkSerializableProps([
      componentDoc("Example", {
        formAction: {
          name: "string | ((formData: FormData) => void | Promise<void>)",
          callableReturn: "unread",
        },
      }),
    ]);

    expect(reports).toStrictEqual([]);
  });
});

describe("the acknowledged baselines", () => {
  const report = (
    component: string,
    prop: string,
    reason: UnserializablePropReport["reason"] = "returns-a-value",
  ) => ({
    component,
    prop,
    type: "((value: unknown) => boolean)",
    reason,
  });

  test("excuses a listed prop and rejects an unlisted one", () => {
    const listed = acknowledgedValueReturningProps[0] ?? "";
    const [component = "", prop = ""] = listed.split(".");

    const reports = [report(component, prop), report("New", "shouldDoThing")];

    expect(rejectedProps(reports)).toStrictEqual([
      report("New", "shouldDoThing"),
    ]);
  });

  /*
   * A value-returning entry excuses exactly that: the same prop handing
   * rendered output back is a different defect.
   */
  test("does not excuse a value-returning entry for rendered output", () => {
    const reports = [
      report("TextField", "validate", "returns-rendered-output"),
    ];

    expect(rejectedProps(reports)).toStrictEqual(reports);
  });

  test("excuses a function alternative on every component via `*.`", () => {
    expect(acknowledgedFunctionAlternativeProps).toContain("*.elementType");

    const reports = [
      report("Text", "elementType", "returns-rendered-output"),
      report("NewComponent", "elementType", "returns-rendered-output"),
    ];

    expect(rejectedProps(reports)).toStrictEqual([]);
  });

  test("reports an entry that no longer matches a generated prop", () => {
    const reports = [
      ...acknowledgedValueReturningProps,
      ...acknowledgedFunctionAlternativeProps,
    ]
      .filter((entry) => entry !== "TextField.validate")
      .map((entry) => {
        const [component = "", prop = ""] = entry.split(".");
        return report(component === "*" ? "Example" : component, prop);
      });

    expect(obsoleteBaselineEntries(reports)).toStrictEqual([
      "TextField.validate",
    ]);
  });
});
