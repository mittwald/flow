import type { RemoteElement } from "@mittwald/flow-remote-core";
import type { Slot, VNodeProps } from "vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

/**
 * Props a React component takes that have no counterpart on a Vue component.
 * `children` and the slot props become Vue slots, `ref`/`key` are Vue's own.
 */
type NonVueProps = "children" | "ref" | "key";

/**
 * The React props of a Flow component, as a Vue component sees them.
 *
 * Event props keep their React spelling (`onPress`, `onChange`, …) on purpose:
 * that is exactly the key Vue's template compiler produces for `@press` /
 * `@change`, so `emits` and the prop type stay one and the same declaration.
 */
export type RemoteVueProps<Props, SlotName extends string> = Partial<
  Omit<Props, NonVueProps | SlotName>
> & {
  /** Rendered by the host as the component's `className`. */
  class?: string;
};

export type RemoteVueSlots<SlotName extends string> = {
  default?: Slot;
} & Record<SlotName, Slot | undefined>;

/**
 * A Vue component wrapping a `flr-*` remote element.
 *
 * Typed through the constructor-signature form Vue's template type-checker
 * understands, which is what makes `@press` / `:is-disabled` / `#emptyView`
 * check against the Flow component's real props in an SFC.
 */
export type FlowRemoteVueComponent<
  Props,
  SlotName extends string = never,
> = new () => {
  $props: VNodeProps & RemoteVueProps<Props, SlotName>;
  $slots: RemoteVueSlots<SlotName>;
};

/**
 * The Flow component's props, read off the remote element class — the same
 * inference `@mittwald/remote-dom-react` uses, so both framework packages take
 * their types from one source.
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
