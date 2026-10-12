import type { ComponentDoc } from "react-docgen-typescript";
import { isProp } from "./propClassifiers";

/*
 * A remote property is transported as data: serialized on one side, structured
 * cloned by `postMessage`, deserialized on the other. Rendered output does not
 * survive that. React tags elements with `$$typeof: Symbol(react.…)`, and
 * `postMessage` refuses symbols — refusing the whole message, so one element in
 * one property drops the entire mutation batch and the extension renders nothing
 * (`Rating.iconFilled` did exactly that, and a remote `List` in table view still
 * does).
 *
 * Rendered output therefore has to be a slot, which the remote side renders and
 * hands over as a child element. `isSlot` recognises `ReactNode` and
 * `ReactElement`; what it cannot turn into a slot is a **function** that returns
 * rendered output, because the host has to call it. Such a prop needs either an
 * eager slot instead or `@flr-ignore-props`, rather than being offered broken.
 *
 * A function that returns a plain *value* is the same defect one step down.
 * `FlowThreadSerialization.isSerializableByBase` accepts any function, so
 * `@quilted/threads` sends it as a proxy — and calling a proxy is a round trip,
 * so the host gets a **Promise**, never the value. A host that awaits it is
 * fine (`ChartTooltip`'s formatters are typed `Promise<string> | string` for
 * exactly that reason); a host that uses the result synchronously gets the
 * Promise object itself. `XAxis.tickFormatter` rendered every tick as
 * `[object Promise]` that way, silently, in both a serialized-connection test
 * and over a real iframe.
 *
 * `FlowThreadSerialization` drops React values so a stray one costs a single
 * property instead of the whole update. This check is the other half: it names
 * the props that will hit that path, at generation time, where they can be
 * designed away.
 */
export interface UnserializablePropReport {
  component: string;
  prop: string;
  type: string;
  reason: "returns-rendered-output" | "is-rendered-output" | "returns-a-value";
}

/**
 * Rendered output as a bare type: `ReactNode`, `ReactElement<…>`,
 * `JSX.Element`.
 */
const isRenderedOutputType = (type: string) =>
  type === "ReactNode" ||
  type === "JSX.Element" ||
  /^ReactElement(<|$)/.test(type);

/*
 * A function type whose return position is rendered output, e.g.
 * `((props: TableBodyRenderProps) => ReactNode)`. Deliberately narrow: it only
 * matches when the type *starts* as a function, so the
 * `AdaptChild*EventHandler<any, ReactElement<…>>` types that every event prop
 * carries are not caught by the `ReactElement` inside their generics.
 */
const returnsRenderedOutput = (type: string) =>
  /^\(?\(/.test(type) &&
  /=>\s*(ReactNode|ReactElement|JSX\.Element)/.test(type);

/*
 * Return positions the host cannot get the value of anyway, so a proxy's
 * Promise costs nothing: `void`/`undefined`/`never` mean fire-and-forget (the
 * shape every `on*` event has), and a declared `Promise` means the host already
 * has to await. `any`/`unknown` say nothing either way — not worth failing a
 * build over a type that was never narrowed.
 */
const returnIsNotConsumed = /^(void|undefined|never|Promise<|any\b|unknown\b)/;

/*
 * Any function arm in the type whose return value the caller can actually use.
 * The type name is a flat string, so this reads the text after each `=>`;
 * `boolean | (() => boolean)` and `string | ((f: FormData) => void)` both have
 * to be classified correctly, and only the first of them is a defect.
 */
const returnsAValue = (type: string) =>
  type
    .split("=>")
    .slice(1)
    .some((returnPosition) => !returnIsNotConsumed.test(returnPosition.trim()));

/*
 * Function properties that predate this check. Each has the same shape as
 * `XAxis.tickFormatter` — a declared non-Promise return the caller reads — so
 * each is a candidate for the same defect. Only `tickFormatter` was reproduced;
 * the rest are unverified, and what each caller does with the Promise differs
 * (`validate` returning a truthy Promise would read as a validation error,
 * `isDateUnavailable` as every date being unavailable). Triage them before
 * changing any of them — https://github.com/mittwald/flow/issues/3110.
 *
 * They are listed rather than ignored on purpose: `@flr-ignore-props` would
 * remove form validation from the remote surface, which is a product decision,
 * not a generator one. The baseline exists so the set cannot grow silently —
 * a new one fails generation, and an entry that no longer matches fails too, so
 * this list shrinks as they are resolved and never goes stale.
 */
export const acknowledgedValueReturningProps: readonly string[] = [
  "Autocomplete.filter",
  "Checkbox.validate",
  "CheckboxButton.validate",
  "CheckboxGroup.validate",
  "ComboBox.defaultFilter",
  "ComboBox.validate",
  "ContextMenu.getTargetRect",
  "ContextMenu.shouldCloseOnInteractOutside",
  "ContextualHelp.getTargetRect",
  "ContextualHelp.shouldCloseOnInteractOutside",
  "DatePicker.isDateUnavailable",
  "DatePicker.shouldCloseOnSelect",
  "DatePicker.validate",
  "DateRangePicker.isDateUnavailable",
  "DateRangePicker.shouldCloseOnSelect",
  "DateRangePicker.validate",
  "MarkdownEditor.validate",
  "NumberField.validate",
  "PasswordCreationField.validate",
  "RadioGroup.validate",
  "RangeCalendar.createCalendar",
  "RangeCalendar.isDateUnavailable",
  "Rating.validate",
  "SearchField.validate",
  "SegmentedControl.validate",
  "Select.validate",
  "TextArea.validate",
  "TextField.validate",
  "TimeField.validate",
];

const keyOf = ({ component, prop }: { component: string; prop: string }) =>
  `${component}.${prop}`;

/**
 * Reports every prop that the generator would ship as a remote property but
 * whose value cannot cross the thread boundary.
 */
export const checkSerializableProps = (
  components: ComponentDoc[],
): UnserializablePropReport[] =>
  components.flatMap((component) =>
    Object.keys(component.props)
      .filter((prop) => isProp(component, prop))
      .flatMap((prop) => {
        const type = component.props[prop]?.type.name ?? "";

        const reason = isRenderedOutputType(type)
          ? ("is-rendered-output" as const)
          : returnsRenderedOutput(type)
            ? ("returns-rendered-output" as const)
            : returnsAValue(type)
              ? ("returns-a-value" as const)
              : undefined;

        return reason
          ? [{ component: component.displayName, prop, type, reason }]
          : [];
      }),
  );

/**
 * The reports the generator must fail on: everything except the acknowledged
 * baseline above.
 */
export const rejectedProps = (
  reports: UnserializablePropReport[],
): UnserializablePropReport[] =>
  reports.filter(
    (report) =>
      report.reason !== "returns-a-value" ||
      !acknowledgedValueReturningProps.includes(keyOf(report)),
  );

/**
 * Baseline entries that no longer describe a generated prop — the prop was
 * fixed, ignored, renamed or removed. Reported so the list cannot outlive what
 * it excuses.
 */
export const obsoleteBaselineEntries = (
  reports: UnserializablePropReport[],
): string[] => {
  const found = new Set(reports.map(keyOf));
  return acknowledgedValueReturningProps.filter((entry) => !found.has(entry));
};

const explain = (reason: UnserializablePropReport["reason"]) => {
  switch (reason) {
    case "returns-rendered-output":
      return "  (host calls it, gets rendered output back)";
    case "returns-a-value":
      return "  (host calls it across the thread, gets a Promise)";
    case "is-rendered-output":
      return "  (rendered output as data)";
  }
};

/**
 * Formats the report for the generator's output. Kept separate so the check
 * itself stays free of presentation.
 */
export const formatUnserializablePropReport = (
  reports: UnserializablePropReport[],
): string =>
  [
    `⚠️  ${reports.length} remote propert${reports.length === 1 ? "y" : "ies"} cannot be serialized:`,
    ...reports.map(
      ({ component, prop, type, reason }) =>
        `    ${component}.${prop}: ${type}` + explain(reason),
    ),
    "    Rendered output has to be a slot, a value the host reads has to be a",
    "    plain prop or an awaited (Promise-typed) one, or the prop needs",
    "    @flr-ignore-props.",
  ].join("\n");

export const formatObsoleteBaselineReport = (entries: string[]): string =>
  [
    `⚠️  ${entries.length} entr${entries.length === 1 ? "y" : "ies"} in acknowledgedValueReturningProps no longer match a generated prop:`,
    ...entries.map((entry) => `    ${entry}`),
    "    Remove them from checkSerializableProps.ts.",
  ].join("\n");
