import { camelize } from "vue";
import { hyphenate } from "@/lib/propKeys";

/**
 * `v-model` on a remote component.
 *
 * Vue compiles `v-model="x"` on a component to `modelValue` plus
 * `onUpdate:modelValue`, and `v-model:is-open="x"` to `is-open` plus
 * `onUpdate:isOpen`. Neither is a key the element knows: the Flow component
 * takes a prop and reports its change as an event of its own. So this maps both
 * halves onto the pair the element has — `value` and `change`, `isOpen` and
 * `openChange`, `selectedKey` and `selectionChange`.
 *
 * A prop can be bound when it is controllable, which Flow — like react-aria —
 * spells as a `default*` sibling (`defaultValue`, `defaultOpen` for `isOpen`),
 * and when the element has the event that reports it.
 */
export interface ModelBinding {
  property: string;
  event: string;
}

/** Tried in order for a bare `v-model`: the first the element has wins. */
const defaultModelProperties = [
  "value",
  "isSelected",
  "selectedKey",
  "selectedKeys",
];

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const uncapitalize = (value: string): string =>
  value.charAt(0).toLowerCase() + value.slice(1);

const isControllable = (
  property: string,
  properties: ReadonlyMap<string, unknown>,
): boolean => {
  if (!properties.has(property)) {
    return false;
  }
  const [, flag] = /^is([A-Z].*)$/.exec(property) ?? [];
  return (
    properties.has(`default${capitalize(property)}`) ||
    (flag !== undefined && properties.has(`default${flag}`))
  );
};

/**
 * The event that reports a prop: `isOpen` → `openChange`, `inputValue` →
 * `inputChange`, `expandedKeys` → `expandedChange`, `selectedKey` →
 * `selectionChange`. `value` and `isSelected` report through `change`.
 */
const eventCandidates = (property: string): string[] => {
  const base = uncapitalize(
    property
      .replace(/^is(?=[A-Z])/, "")
      .replace(/(^value|Value|Keys|Key)$/, ""),
  );

  return [
    ...(base === "" ? [] : [`${base}Change`]),
    ...(base === "selected" ? ["selectionChange", "change"] : []),
    ...(base === "" ? ["change"] : []),
  ];
};

export const createModelResolver = (
  properties: ReadonlyMap<string, unknown>,
  events: ReadonlyMap<string, unknown>,
) => {
  const resolve = (property: string): ModelBinding | undefined => {
    if (!isControllable(property, properties)) {
      return undefined;
    }
    const event = eventCandidates(property).find((name) => events.has(name));
    return event === undefined ? undefined : { property, event };
  };

  const defaultBinding = defaultModelProperties
    .map(resolve)
    .find((binding) => binding !== undefined);

  return {
    /**
     * The binding for a `v-model` argument as the template wrote it —
     * `modelValue` for a bare `v-model`, else the prop in either spelling.
     */
    resolve: (argument: string): ModelBinding | undefined =>
      argument === "modelValue" ? defaultBinding : resolve(camelize(argument)),
  };
};

/** `onUpdate:isOpen` → `isOpen`. */
export const modelUpdateArgument = (key: string): string | undefined =>
  key.startsWith("onUpdate:") ? key.slice("onUpdate:".length) : undefined;

/**
 * The modifiers of a `v-model`, which Vue passes as a prop of their own:
 * `modelModifiers`, or `<arg>Modifiers` in whichever spelling the template used
 * — Vue's own `emit` looks up the same three.
 */
export const modelModifierKeys = (argument: string): string[] =>
  argument === "modelValue"
    ? ["modelModifiers"]
    : [
        `${argument}Modifiers`,
        `${camelize(argument)}Modifiers`,
        `${hyphenate(argument)}Modifiers`,
      ];

export const isModelModifierKey = (key: string): boolean =>
  key.endsWith("Modifiers");

/**
 * `.trim` and `.number`, which Vue's `emit` applies for a component that emits
 * `update:*` itself. The element reports the value, not an emit, so they are
 * applied here.
 */
export const applyModelModifiers = (
  value: unknown,
  modifiers: Record<string, unknown> | undefined,
): unknown => {
  let result = value;
  if (modifiers?.trim && typeof result === "string") {
    result = result.trim();
  }
  if (modifiers?.number && typeof result === "string") {
    const number = Number.parseFloat(result);
    result = Number.isNaN(number) ? result : number;
  }
  return result;
};
