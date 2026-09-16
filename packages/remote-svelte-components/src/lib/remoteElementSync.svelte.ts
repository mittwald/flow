import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import { onMount } from "svelte";
import { version } from "../version.js";
import { controlledRemoteValue } from "./controlledRemoteValue.js";
import { consumePropsContext } from "./propsContext.js";
import { useComponentUsage } from "./remoteContext.svelte.js";
import type { AnyRecord, FlowRemoteElementConfig } from "./types.js";

export interface RemoteElementBinding {
  /** Bound to the rendered element with `bind:this`. */
  node: HTMLElement | undefined;
}

/**
 * Everything a `flr-*` element needs that is not its markup: the props context,
 * the remote properties, the event listeners, the usage report.
 *
 * Shared by the two components that render the element, which differ only in
 * whether they put anything inside it — see `RemoteElement.svelte`.
 */
export const useRemoteElementSync = (
  config: FlowRemoteElementConfig,
  getProps: () => AnyRecord,
): RemoteElementBinding => {
  const { tag, name, element, slotNames = [] } = config;

  /*
   * Read once, while the component initializes — that is when a Svelte context
   * is readable at all. A composite that configures a changing value puts a
   * getter in the context, so the reads below stay reactive.
   */
  const contextProps = consumePropsContext(name);
  const reportUsage = useComponentUsage(name);
  const controlled = controlledRemoteValue(tag);
  const events = element.remoteEventDefinitions;

  const binding = $state<RemoteElementBinding>({ node: undefined });

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

  /**
   * Splits the props into remote properties and event listeners.
   *
   * Nothing is renamed on the way: Svelte hands a component its props with
   * their casing intact, so `isDisabled`, `aria-label` and `data-testid` all
   * arrive spelled the way the element declares them. Only `class` is
   * translated, because that is the attribute a Svelte author writes.
   */
  const readProps = () => {
    const rest = getProps();
    const merged: AnyRecord = { ...rest, ...contextProps };

    const propertyValues = new Map<string, unknown>([
      [FlowRemoteElement.initializationPropertyName, true],
      [FlowRemoteElement.versionPropertyName, version],
    ]);
    const listeners = new Map<string, EventListener>();

    for (const [key, value] of Object.entries(merged)) {
      if (key === "class" || key === "className" || slotNames.includes(key)) {
        continue;
      }

      /*
       * An event's name is the React prop without `on`, first letter
       * lowercased — `onPress` → `press`. Matched against the element's own
       * set, so a prop that merely looks like a handler stays a property.
       */
      const [, initial, tail] = /^on([A-Z])(.*)$/.exec(key) ?? [];
      if (initial !== undefined) {
        const event = initial.toLowerCase() + tail;
        if (events.has(event) && typeof value === "function") {
          listeners.set(event, value as EventListener);
          continue;
        }
      }

      propertyValues.set(key, value);
    }

    /*
     * A composite's classes and the author's are both wanted — `Modal` asks for
     * `flow--modal` on a component the app may also have given a class of its
     * own.
     */
    if ("class" in merged || "className" in merged) {
      const classNames = [
        rest.class,
        rest.className,
        contextProps?.class,
        contextProps?.className,
      ].filter((value): value is string => !!value);

      propertyValues.set("className", classNames.join(" ") || undefined);
    }

    return {
      properties: controlled.mapProperties(Object.fromEntries(propertyValues)),
      listeners,
    };
  };

  const syncElement = (target: HTMLElement) => {
    const { properties, listeners } = readProps();

    for (const [key, value] of Object.entries(properties)) {
      if (appliedProperties.has(key) && appliedProperties.get(key) === value) {
        continue;
      }
      appliedProperties.set(key, value);

      if (key in target) {
        (target as AnyRecord)[key] = value;
      } else if (value == null) {
        target.removeAttribute(key);
      } else {
        target.setAttribute(key, String(value));
      }
    }

    for (const [event, applied] of appliedListeners) {
      if (listeners.get(event) !== applied.supplied) {
        target.removeEventListener(event, applied.attached);
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
      target.addEventListener(event, attached);
      appliedListeners.set(event, { supplied, attached });
    }
  };

  /*
   * Imperatively, and after the element is in the DOM: a remote property is a
   * JS value, not a string, so it cannot go through the template's own
   * attribute handling. An `$effect` runs post-render and re-runs on every prop
   * it reads.
   */
  $effect(() => {
    const target = binding.node;
    if (target) {
      syncElement(target);
    }
  });

  $effect(() => () => {
    for (const [event, applied] of appliedListeners) {
      binding.node?.removeEventListener(event, applied.attached);
    }
    appliedListeners.clear();
  });

  onMount(reportUsage);

  return binding;
};
