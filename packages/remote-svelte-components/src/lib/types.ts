import type {
  RemoteElement,
  RemoteElementConstructor,
} from "@mittwald/flow-remote-core";
import type { Snippet } from "svelte";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

/**
 * Props a React component takes that have no counterpart on a Svelte one.
 * `children` and the slot props become snippets, `ref`/`key` are React's own.
 */
type NonSvelteProps = "children" | "ref" | "key";

/**
 * The React props of a Flow component, as a Svelte component sees them.
 *
 * Event props keep their React spelling (`onPress`, `onChange`, …). Svelte
 * passes a component's props through with their casing intact, so the Flow prop
 * name _is_ the Svelte prop name — there is nothing to translate.
 */
export type FlowRemoteProps<Props, SlotName extends string = never> = Partial<
  Omit<Props, NonSvelteProps | SlotName>
> & {
  /** Rendered by the host as the component's `className`. */
  class?: string;
  /**
   * Put on the rendered element by the host. Declared for every component by
   * `FlowRemoteElement`, which is one level below the React props type this is
   * built from — so it has to be added back here.
   */
  "data-testid"?: string;
  children?: Snippet;
} & Partial<Record<SlotName, Snippet>>;

/**
 * The Flow component's props, read off the remote element class — the same
 * inference `@mittwald/remote-dom-react` uses, so every framework package takes
 * its types from one source.
 */
export type PropertiesOf<ElementConstructor> =
  ElementConstructor extends new () => RemoteElement<
    infer Properties,
    AnyRecord,
    AnyRecord,
    AnyRecord
  >
    ? Properties
    : never;

/**
 * What a generated component knows and the app does not pass — in one object,
 * under one key, on purpose.
 *
 * As separate props they would collide with the Flow component's own: every
 * form field takes a `name`, and `<RemoteElement name="TextField" {...props}
 * />` lets `name="callsign"` win. The component then reports itself as
 * "callsign", and the real `name` never reaches the host at all.
 */
export interface FlowRemoteElementConfig {
  /** The custom element to render, e.g. `flr-button`. */
  tag: string;
  /** The Flow component's name — how usage and props context refer to it. */
  name: string;
  /** The element class, for its property and event definitions. */
  element: RemoteElementConstructor<AnyRecord, AnyRecord, AnyRecord, AnyRecord>;
  /**
   * The Flow component's `ReactNode`-typed props. They arrive as snippets and
   * travel as slotted children, never as remote properties — a rendered subtree
   * does not survive structured clone.
   */
  slotNames?: readonly string[];
}
