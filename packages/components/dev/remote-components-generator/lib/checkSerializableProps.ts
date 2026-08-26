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
 * `FlowThreadSerialization` drops React values so a stray one costs a single
 * property instead of the whole update. This check is the other half: it names
 * the props that will hit that path, at generation time, where they can be
 * designed away.
 */
export interface UnserializablePropReport {
  component: string;
  prop: string;
  type: string;
  reason: "returns-rendered-output" | "is-rendered-output";
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
            : undefined;

        return reason
          ? [{ component: component.displayName, prop, type, reason }]
          : [];
      }),
  );

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
        `    ${component}.${prop}: ${type}` +
        (reason === "returns-rendered-output"
          ? "  (host calls it, gets rendered output back)"
          : "  (rendered output as data)"),
    ),
    "    Rendered output has to be a slot, or the prop needs @flr-ignore-props.",
  ].join("\n");
