import { controlledRemoteValue } from "@/lib/controlledRemoteValue";
import { useComponentUsage } from "@/composables/useComponentUsage";
import { callHandlers, flattenHandlers } from "@/lib/handlers";
import { hyphenate } from "@/lib/propKeys";
import {
  applyModelModifiers,
  createModelResolver,
  isModelModifierKey,
  modelModifierKeys,
  modelUpdateArgument,
} from "@/lib/vModel";
import type {
  AnyRecord,
  FlowRemoteVueComponent,
  PropertiesOf,
} from "@/lib/types";
import { version } from "@/version";
import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import type { RemoteElementConstructor } from "@mittwald/flow-remote-core";
import {
  camelize,
  defineComponent,
  effectScope,
  h,
  isReactive,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  toRaw,
  watch,
  type VNode,
} from "vue";

const slotWrapperTag = "flr-slot-root-wrapper";

export interface CreateFlowRemoteComponentOptions<
  SlotName extends readonly string[],
> {
  /**
   * The component's slot props (`ReactNode`-typed props of the Flow component).
   * They are passed as named Vue slots and travel as slotted children, never as
   * remote properties — a rendered subtree does not survive structured clone.
   */
  slots?: SlotName;
  /**
   * The component's boolean props. A bare attribute (`<TextField is-required>`)
   * reaches the wrapper as `""`, which is falsy on the host; these are read as
   * `true` instead, the way Vue casts a declared `Boolean`.
   */
  booleans?: readonly string[];
}

/**
 * Wraps a `flr-*` remote element in a Vue component.
 *
 * Everything the wrapper needs at runtime — which keys are remote properties,
 * which are events, which are slots — is already on the element class
 * (`remotePropertyDefinitions`, `remoteEventDefinitions`,
 * `remoteSlotDefinitions`). So unlike the React counterpart, which has the
 * generator write an `eventProps` map into every generated file, this factory
 * reads the element's own metadata. What a generated file still names is what
 * the element cannot tell at runtime: its slots and its boolean props.
 */
export function createFlowRemoteComponent<
  ElementConstructor extends RemoteElementConstructor<
    AnyRecord,
    AnyRecord,
    AnyRecord,
    AnyRecord
  >,
  const SlotNames extends readonly string[] = [],
>(
  tag: string,
  name: string,
  Element: ElementConstructor,
  options: CreateFlowRemoteComponentOptions<SlotNames> = {},
): FlowRemoteVueComponent<PropertiesOf<ElementConstructor>, SlotNames[number]> {
  const slotNames = options.slots ?? [];
  const booleans = new Set(options.booleans);
  const events = Element.remoteEventDefinitions;
  const properties = Element.remotePropertyDefinitions;
  const attributes = Element.remoteAttributeDefinitions;
  const model = createModelResolver(properties, events);
  const warnedModels = new Set<string>();
  const warnUnboundModel = (argument: string) => {
    if (warnedModels.has(argument)) {
      return;
    }
    warnedModels.add(argument);
    const directive =
      argument === "modelValue" ? "v-model" : `v-model:${argument}`;
    console.warn(
      `[flow] ${directive} on <${name}> binds nothing: the component has no ` +
        `controllable prop by that name. Pass the prop and listen to its ` +
        `change event instead.`,
    );
  };

  const component = defineComponent({
    name: `FlowRemote(${name})`,
    /*
     * Everything arrives through `attrs` instead of declared props. Vue only
     * camelizes keys of *declared* props, and the set of props here is the Flow
     * component's whole React surface — declaring all of it would mean shipping
     * a second copy of the contract. The wrapper camelizes the keys itself
     * below, so `:is-disabled` and `:isDisabled` both reach `isDisabled`.
     */
    inheritAttrs: false,

    setup(_props, { attrs, slots }) {
      const elementRef = ref<HTMLElement>();
      const appliedProperties = new Map<string, unknown>();
      /*
       * An array or object changed in place — `data.value.push(point)` — is the
       * same reference afterwards, and both this wrapper and remote-dom skip
       * a property whose value is identical. So a reactive one is watched
       * deeply, and a change hands the element a fresh copy, which is what
       * crosses to the host. Watchers live in a scope of their own, stopped
       * with the component.
       */
      const deepScope = effectScope();
      const deepWatches = new Map<string, { source: unknown; stop(): void }>();
      const watchDeeply = (
        element: HTMLElement,
        key: string,
        value: unknown,
      ) => {
        const current = deepWatches.get(key);
        if (current?.source === value) {
          return;
        }
        current?.stop();
        deepWatches.delete(key);

        if (!isReactive(value) || typeof value !== "object" || value === null) {
          return;
        }
        const raw = toRaw(value);
        if (
          !Array.isArray(raw) &&
          Object.getPrototypeOf(raw) !== Object.prototype
        ) {
          return;
        }
        const stop = deepScope.run(() =>
          watch(
            () => value,
            () => {
              (element as AnyRecord)[key] = Array.isArray(value)
                ? [...value]
                : { ...value };
            },
            { deep: true },
          ),
        );
        if (stop) {
          deepWatches.set(key, { source: value, stop });
        }
      };
      /*
       * One listener per event, attached while the event has a handler and
       * calling whatever the latest render supplied. `FlowRemoteElement` keys
       * its own listener map on the function it was handed, so removing has
       * to pass back that exact reference.
       */
      const attachedListeners = new Map<string, EventListener>();
      let currentHandlers = new Map<string, unknown[]>();
      const reportUsage = useComponentUsage(name);
      const controlled = controlledRemoteValue(tag);

      /**
       * Splits the attrs Vue collected into remote properties and event
       * listeners, and normalizes the two spellings Vue templates produce.
       */
      const readAttrs = () => {
        const propertyValues = new Map<string, unknown>([
          [FlowRemoteElement.initializationPropertyName, true],
          [FlowRemoteElement.versionPropertyName, version],
        ]);
        const listeners = new Map<string, unknown[]>();
        const addListeners = (event: string, handlers: unknown[]) =>
          listeners.set(event, [...(listeners.get(event) ?? []), ...handlers]);

        for (const rawKey of Object.keys(attrs)) {
          /*
           * `v-model`: the value half becomes the prop it binds, the update
           * half a listener on the event reporting it. Unknown to the element,
           * either would otherwise land as a stray attribute — a field that
           * shows nothing and never writes back.
           */
          const updateArgument = modelUpdateArgument(rawKey);
          if (updateArgument !== undefined) {
            const binding = model.resolve(updateArgument);
            if (!binding) {
              warnUnboundModel(updateArgument);
              continue;
            }
            const handlers = flattenHandlers(attrs[rawKey]);
            const modifiers = modelModifierKeys(updateArgument)
              .map((key) => attrs[key] as Record<string, unknown> | undefined)
              .find((value) => value !== undefined);
            if (handlers.length > 0) {
              addListeners(binding.event, [
                (payload: unknown) =>
                  callHandlers(
                    handlers,
                    applyModelModifiers(payload, modifiers),
                  ),
              ]);
            }
            continue;
          }
          if (rawKey === "modelValue") {
            const binding = model.resolve(rawKey);
            if (binding) {
              propertyValues.set(binding.property, attrs[rawKey]);
            } else {
              warnUnboundModel(rawKey);
            }
            continue;
          }
          if (
            isModelModifierKey(rawKey) &&
            !properties.has(rawKey) &&
            !attributes.has(rawKey)
          ) {
            continue;
          }

          /*
           * Off the remote surface by design (the generator's global ignore
           * list), and dropped by the host anyway — as in React, silently.
           */
          if (rawKey === "style") {
            continue;
          }

          const value = attrs[rawKey];

          /*
           * `@press` and `@hover-change` both compile to `onPress` /
           * `onHoverChange`: Vue's compiler camelizes a v-on argument. What is
           * left is mapping that back onto the element's event name, which is
           * the React prop without its `on` prefix.
           */
          const [, initial, rest] = /^on([A-Z])(.*)$/.exec(rawKey) ?? [];
          if (initial !== undefined) {
            const event = initial.toLowerCase() + rest;
            /*
             * A list when a composite merged its handler with the author's —
             * Vue's `mergeProps` combines both into an array.
             */
            const handlers = flattenHandlers(value);
            if (events.has(event) && (handlers.length > 0 || value == null)) {
              if (handlers.length > 0) {
                addListeners(event, handlers);
              }
              continue;
            }
          }

          /*
           * Bound attributes are *not* camelized by Vue, so a template written
           * in Vue's own kebab-case style (`:is-disabled`) would otherwise miss
           * every remote property and end up as a stray DOM attribute.
           *
           * Only where the element does not know the key as written: Flow
           * declares plenty of dashed props — `aria-label`, `data-testid`,
           * `aria-expanded` — and camelizing those loses them. `aria-*` limped
           * along by accident, because the DOM reflects `ariaLabel` back onto
           * the attribute; `data-testid` has no such reflection and simply
           * never reached the host.
           */
          const isDeclared = properties.has(rawKey) || attributes.has(rawKey);
          const key =
            rawKey === "class"
              ? "className"
              : isDeclared
                ? rawKey
                : camelize(rawKey);
          propertyValues.set(
            key,
            booleans.has(key) && (value === "" || value === hyphenate(key))
              ? true
              : value,
          );
        }

        return {
          properties: controlled.mapProperties(
            Object.fromEntries(propertyValues),
          ),
          listeners,
        };
      };

      const syncElement = () => {
        const element = elementRef.value;
        if (!element) {
          return;
        }

        const { properties, listeners } = readAttrs();

        /*
         * A key that is gone has to be taken off the element, not merely left
         * alone: a render function that builds its props conditionally drops
         * the key rather than passing `undefined`, and the loop below only
         * visits what is there now. Without this the element keeps the last
         * value it was handed — a button that stays disabled after the thing
         * that disabled it is over.
         */
        for (const key of [...appliedProperties.keys()]) {
          if (key in properties) {
            continue;
          }
          appliedProperties.delete(key);
          watchDeeply(element, key, undefined);

          if (key in element) {
            (element as AnyRecord)[key] = undefined;
          } else {
            element.removeAttribute(key);
          }
        }

        for (const [key, value] of Object.entries(properties)) {
          if (appliedProperties.get(key) === value) {
            continue;
          }
          appliedProperties.set(key, value);

          if (key in element) {
            (element as AnyRecord)[key] = value;
            watchDeeply(element, key, value);
          } else if (value == null) {
            element.removeAttribute(key);
          } else {
            element.setAttribute(key, String(value));
          }
        }

        currentHandlers = listeners;

        for (const [event, attached] of attachedListeners) {
          if (!listeners.has(event)) {
            element.removeEventListener(event, attached);
            attachedListeners.delete(event);
          }
        }

        for (const event of listeners.keys()) {
          if (attachedListeners.has(event)) {
            continue;
          }
          const attached: EventListener = (payload) => {
            controlled.recordEventPayload(event, payload);
            callHandlers(currentHandlers.get(event), payload);
          };
          element.addEventListener(event, attached);
          attachedListeners.set(event, attached);
        }
      };

      onMounted(() => {
        syncElement();
        reportUsage();
      });
      onUpdated(syncElement);

      onBeforeUnmount(() => {
        const element = elementRef.value;
        for (const [event, attached] of attachedListeners) {
          element?.removeEventListener(event, attached);
        }
        attachedListeners.clear();
      });

      return () => {
        const children: (VNode | VNode[])[] = slots.default?.() ?? [];

        for (const slotName of slotNames) {
          const slot = slots[slotName];
          if (!slot) {
            continue;
          }
          /*
           * A slot prop is rendered into a wrapper element carrying
           * `slot="<name>"`, which is what the host renderer maps back onto the
           * Flow component's prop. Forced to an attribute (`^`) because
           * `slot` reaches the remote tree through `attributeChangedCallback`.
           */
          children.push(
            h(
              slotWrapperTag,
              /*
               * Keyed by the slot name, because the wrappers are a list and
               * only the slots that have content are in it. Unkeyed, Vue
               * matches them by position: a slot that appears turns the
               * wrapper at that index into a different slot and rebuilds
               * everything after it. What that costs is not a repaint — the
               * host re-materialises those components, so an element the user
               * was on is replaced and the focus lands on `<body>`. Expanding
               * an accordion item did exactly that to its own toggle.
               */
              { key: slotName, "^slot": slotName },
              slot(),
            ) as VNode,
          );
        }

        return h(tag, { ref: elementRef }, children);
      };
    },
  });

  return component as unknown as FlowRemoteVueComponent<
    PropertiesOf<ElementConstructor>,
    SlotNames[number]
  >;
}

export default createFlowRemoteComponent;
