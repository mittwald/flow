import { controlledRemoteValue } from "@/lib/controlledRemoteValue";
import { useComponentUsage } from "@/composables/useComponentUsage";
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
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
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
}

/**
 * Wraps a `flr-*` remote element in a Vue component.
 *
 * Everything the wrapper needs at runtime — which keys are remote properties,
 * which are events, which are slots — is already on the element class
 * (`remotePropertyDefinitions`, `remoteEventDefinitions`,
 * `remoteSlotDefinitions`). So unlike the React counterpart, which has the
 * generator write an `eventProps` map into every generated file, this factory
 * reads the element's own metadata and the generated files stay one line.
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
  const events = Element.remoteEventDefinitions;
  const properties = Element.remotePropertyDefinitions;
  const attributes = Element.remoteAttributeDefinitions;

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
       * Both the listener the template supplied and the one actually attached:
       * `FlowRemoteElement` keys its own listener map on the function it was
       * handed, so removing has to pass back that exact reference.
       */
      const appliedListeners = new Map<
        string,
        { supplied: EventListener; attached: EventListener }
      >();
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
        const listeners = new Map<string, EventListener>();

        for (const rawKey of Object.keys(attrs)) {
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
            if (events.has(event) && typeof value === "function") {
              listeners.set(event, value as EventListener);
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
          propertyValues.set(key, value);
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

        for (const [key, value] of Object.entries(properties)) {
          if (appliedProperties.get(key) === value) {
            continue;
          }
          appliedProperties.set(key, value);

          if (key in element) {
            (element as AnyRecord)[key] = value;
          } else if (value == null) {
            element.removeAttribute(key);
          } else {
            element.setAttribute(key, String(value));
          }
        }

        for (const [event, applied] of appliedListeners) {
          if (listeners.get(event) !== applied.supplied) {
            element.removeEventListener(event, applied.attached);
            appliedListeners.delete(event);
          }
        }

        for (const [event, supplied] of listeners) {
          if (appliedListeners.has(event)) {
            continue;
          }
          const attached: EventListener = (payload) => {
            controlled.recordEventPayload(event, payload);
            supplied(payload);
          };
          element.addEventListener(event, attached);
          appliedListeners.set(event, { supplied, attached });
        }
      };

      onMounted(() => {
        syncElement();
        reportUsage();
      });
      onUpdated(syncElement);

      onBeforeUnmount(() => {
        const element = elementRef.value;
        for (const [event, applied] of appliedListeners) {
          element?.removeEventListener(event, applied.attached);
        }
        appliedListeners.clear();
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
            h(slotWrapperTag, { "^slot": slotName }, slot()) as VNode,
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
