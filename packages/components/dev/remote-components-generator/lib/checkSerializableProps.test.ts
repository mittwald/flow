import type { ComponentDoc } from "react-docgen-typescript";
import { describe, expect, test } from "vitest";
import {
  acknowledgedValueReturningProps,
  checkSerializableProps,
  obsoleteBaselineEntries,
  rejectedProps,
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
  props: Record<string, string>,
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
          type: { name: type },
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
  test("reports a function that hands rendered output back to the host", () => {
    const reports = checkSerializableProps([
      componentDoc("TableBody", {
        renderEmptyState: "((props: TableBodyRenderProps) => ReactNode)",
      }),
    ]);

    expect(reports).toStrictEqual([
      {
        component: "TableBody",
        prop: "renderEmptyState",
        type: "((props: TableBodyRenderProps) => ReactNode)",
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
    const type = "((value: unknown, index: number) => string)";
    const reports = checkSerializableProps([
      componentDoc("XAxis", { tickFormatter: type }),
    ]);

    expect(reports).toStrictEqual([
      {
        component: "XAxis",
        prop: "tickFormatter",
        type,
        reason: "returns-a-value",
      },
    ]);
  });

  test("finds the value-returning arm inside a union", () => {
    const reports = checkSerializableProps([
      componentDoc("DatePicker", {
        shouldCloseOnSelect: "boolean | (() => boolean)",
      }),
    ]);

    expect(reports.map((r) => r.reason)).toStrictEqual(["returns-a-value"]);
  });

  /*
   * A return the host cannot read is fine — that is what every `on*` event is,
   * and `formAction` is the same shape under a name the event rule misses. A
   * `Promise` return says the host already awaits, which is how `ChartTooltip`'s
   * formatters are typed.
   */
  test("stays quiet about functions whose return value nobody reads", () => {
    const reports = checkSerializableProps([
      componentDoc("Example", {
        formAction: "string | ((formData: FormData) => void | Promise<void>)",
        formatter: "((value: string) => string | Promise<string>)",
        never: "(() => never)",
      }),
    ]);

    expect(reports.map((r) => `${r.prop}: ${r.reason}`)).toStrictEqual([
      // only the one that returns `string` before the union's Promise arm
      "formatter: returns-a-value",
    ]);
  });
});

describe("the acknowledged value-returning baseline", () => {
  const report = (component: string, prop: string) => ({
    component,
    prop,
    type: "((value: unknown) => boolean)",
    reason: "returns-a-value" as const,
  });

  test("excuses a listed prop and rejects an unlisted one", () => {
    const listed = acknowledgedValueReturningProps[0] ?? "";
    const [component = "", prop = ""] = listed.split(".");

    const reports = [report(component, prop), report("New", "shouldDoThing")];

    expect(rejectedProps(reports)).toStrictEqual([
      report("New", "shouldDoThing"),
    ]);
  });

  test("reports an entry that no longer matches a generated prop", () => {
    const stale = acknowledgedValueReturningProps.filter(
      (entry) => entry !== "TextField.validate",
    );

    expect(
      obsoleteBaselineEntries([report("TextField", "validate")]),
    ).toStrictEqual(stale);
  });
});
