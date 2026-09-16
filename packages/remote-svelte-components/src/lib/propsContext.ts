import { getContext, setContext } from "svelte";
import type { AnyRecord } from "./types.js";

/**
 * Svelte's stand-in for Flow's `PropsContext` — and, unlike Vue's `cloneVNode`
 * stand-in, the same mechanism React uses: a value set on a component reaches
 * every descendant, not just the children the composite was handed.
 *
 * Flow configures the components inside a composite through it — the `Heading`
 * of a `Modal`, the `Button` of an `Action` — keyed by component name.
 */
export type FlowPropsContext = Record<string, AnyRecord>;

const propsContextKey = Symbol.for("flow.remote.svelte.propsContext");

/**
 * Declares the props for the components below. Replaces whatever a surrounding
 * composite declared rather than merging with it: each composite states its own
 * contract in full, which is what keeps a `ModalTrigger`'s `onPress` off the
 * buttons inside the `Modal` it opens.
 *
 * Has to be called while the component initializes, like every Svelte context.
 */
export const setPropsContext = (context: FlowPropsContext): void => {
  setContext(propsContextKey, context);
};

/**
 * The props a surrounding composite declared for this component, and the end of
 * their reach.
 *
 * Reading clears the context for this component's own subtree — Flow does the
 * same: every `flowComponent` of type `ui` wraps its children in a
 * `ClearPropsContext`, so a `Heading` nested inside a `Modal`'s `Content` is
 * not configured as the modal's header.
 */
export const consumePropsContext = (
  component: string,
  options: { isProvider?: boolean } = {},
): AnyRecord | undefined => {
  const context = getContext<FlowPropsContext | undefined>(propsContextKey);

  /*
   * A provider is the exception, and Flow makes the same one: `flowComponent`
   * defaults to the `"ui"` type, which clears, and `@flr-provider` carries
   * `type: "provider"` over so it does not. A provider that cleared would drop
   * the props context set around it before its own children could read it —
   * `ModalTrigger` around a `DialogTrigger` around the `Button` it configures.
   */
  if (!options.isProvider) {
    setContext(propsContextKey, undefined);
  }

  return context?.[component];
};
