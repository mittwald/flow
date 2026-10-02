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
> &
  ModelProps<Props> & {
    /** Rendered by the host as the component's `className`. */
    class?: string;
  };

/**
 * The props `v-model` can bind: those Flow makes controllable, which it spells
 * with a `default*` sibling — `value`/`defaultValue`, `isOpen`/`defaultOpen`.
 * The runtime rule is in `src/lib/vModel.ts`.
 */
type ControllableKey<Props> = {
  [K in keyof Props & string]: `default${Capitalize<K>}` extends keyof Props
    ? K
    : K extends `is${infer Flag}`
      ? `default${Flag}` extends keyof Props
        ? K
        : never
      : never;
}[keyof Props & string];

/** What a bare `v-model` binds: the first of these the component has. */
type DefaultModelKey<Props> =
  Extract<
    ControllableKey<Props>,
    "value" | "isSelected" | "selectedKey" | "selectedKeys"
  > extends infer Candidates
    ? "value" extends Candidates
      ? "value"
      : "isSelected" extends Candidates
        ? "isSelected"
        : "selectedKey" extends Candidates
          ? "selectedKey"
          : "selectedKeys" extends Candidates
            ? "selectedKeys"
            : never
    : never;

/* What the element reports is the new value itself, never `undefined`. */
type Reported<Value> = Exclude<Value, undefined>;

type ModelProps<Props> = {
  [K in ControllableKey<Props> as `onUpdate:${K}`]?: (
    value: Reported<Props[K]>,
  ) => void;
} & ([DefaultModelKey<Props>] extends [never]
  ? unknown
  : {
      modelValue?: Props[DefaultModelKey<Props> & keyof Props];
      "onUpdate:modelValue"?: (
        value: Reported<Props[DefaultModelKey<Props> & keyof Props]>,
      ) => void;
    });

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
