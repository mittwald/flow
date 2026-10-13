import type { RemoteElement } from "@mittwald/flow-remote-core";
import type { Slot, VNodeProps } from "vue";
import type { defaultModelProperties, modelEventAliases } from "@/lib/vModel";

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
 * The props `v-model` can bind — the rule `src/lib/vModel.ts` applies at
 * runtime, over the props type. A prop is controllable, which Flow spells with
 * a `default*` sibling (`value`/`defaultValue`, `isOpen`/`defaultOpen` or
 * `isDefaultOpen`), and the component has the event reporting it (`onChange`,
 * `onOpenChange`, …).
 */
type ModelKey<Props> = {
  [K in keyof Props & string]: [
    Extract<DefaultSibling<K>, keyof Props>,
  ] extends [never]
    ? never
    : [Extract<`on${Capitalize<ModelEvent<K>>}`, keyof Props>] extends [never]
      ? never
      : K;
}[keyof Props & string];

/** `isOpen` → `Open`; nothing for a key that is not `is<Upper>…`. */
type Flag<K extends string> = K extends `is${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? never
    : Rest
  : never;

type DefaultSibling<K extends string> =
  `default${Capitalize<K>}` | `default${Flag<K>}` | `isDefault${Flag<K>}`;

/** `isOpen` → `open`, `inputValue` → `input`, `selectedKeys` → `selected`. */
type ModelBase<K extends string> = Uncapitalize<
  WithoutValueSuffix<[Flag<K>] extends [never] ? K : Flag<K>>
>;

type WithoutValueSuffix<K extends string> = K extends "value"
  ? ""
  : K extends `${infer Base}Value`
    ? Base
    : K extends `${infer Base}Keys`
      ? Base
      : K extends `${infer Base}Key`
        ? Base
        : K;

type ModelEvent<K extends string> =
  | (ModelBase<K> extends "" ? never : `${ModelBase<K>}Change`)
  | (ModelBase<K> extends keyof typeof modelEventAliases
      ? (typeof modelEventAliases)[ModelBase<K>][number]
      : never);

/** What a bare `v-model` binds: the first of these the component has. */
type DefaultModelKey<
  Props,
  Candidates extends readonly string[] = typeof defaultModelProperties,
> = Candidates extends readonly [
  infer Head extends string,
  ...infer Rest extends readonly string[],
]
  ? Head extends ModelKey<Props>
    ? Head
    : DefaultModelKey<Props, Rest>
  : never;

/* What the element reports is the new value itself, never `undefined`. */
type Reported<Value> = Exclude<Value, undefined>;

type ModelProps<Props> = {
  [K in ModelKey<Props> as `onUpdate:${K}`]?: (
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
