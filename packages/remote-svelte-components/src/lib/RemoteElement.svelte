<script lang="ts">
  import type { RemoteElementConstructor } from "@mittwald/flow-remote-core";
  import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
  import { onMount, type Snippet } from "svelte";
  import { version } from "../version.js";
  import { controlledRemoteValue } from "./controlledRemoteValue.js";
  import { consumePropsContext } from "./propsContext.js";
  import { useComponentUsage } from "./remoteContext.svelte.js";
  import { slotAttribute } from "./slotAttribute.js";
  import type { AnyRecord } from "./types.js";

  /**
   * Wraps a `flr-*` remote element in a Svelte component.
   *
   * Everything this needs at runtime — which keys are remote properties, which
   * are events — is already on the element class
   * (`remotePropertyDefinitions`, `remoteEventDefinitions`), so it is read
   * there instead of having the generator write an event map into every
   * generated file, the way the React package does.
   */
  /**
   * What the generated component knows and the app does not pass — in one
   * object, under one key, on purpose.
   *
   * As separate props they would collide with the Flow component's own: every
   * form field takes a `name`, and `<RemoteElement name="TextField"
   * {...props} />` lets `name="callsign"` win. The component then reports
   * itself as "callsign", and the real `name` never reaches the host at all,
   * because the wrapper destructures it away — a form field silently without a
   * name, in the `FormData` the host collects.
   */
  interface FlowRemoteElementConfig {
    /** The custom element to render, e.g. `flr-button`. */
    tag: string;
    /** The Flow component's name — how usage and props context refer to it. */
    name: string;
    /** The element class, for its property and event definitions. */
    element: RemoteElementConstructor<
      AnyRecord,
      AnyRecord,
      AnyRecord,
      AnyRecord
    >;
    /**
     * The Flow component's `ReactNode`-typed props. They arrive as snippets and
     * travel as slotted children, never as remote properties — a rendered
     * subtree does not survive structured clone.
     */
    slotNames?: readonly string[];
  }

  interface Props {
    __flr: FlowRemoteElementConfig;
    children?: Snippet;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
  }

  const { __flr, children, ...rest }: Props = $props();

  // The configuration identifies the component and never changes.
  // svelte-ignore state_referenced_locally
  const { tag, name, element, slotNames = [] } = __flr;

  /*
   * Read once, while the component initializes — that is when a Svelte context
   * is readable at all. A composite that configures a changing value puts a
   * getter in the context, so the reads below stay reactive.
   */
  /*
   * `tag`, `name` and `element` identify the component and never change, so
   * reading them once is the point — that is what the ignore below says.
   */
  // svelte-ignore state_referenced_locally
  const contextProps = consumePropsContext(name);
  // svelte-ignore state_referenced_locally
  const reportUsage = useComponentUsage(name);
  // svelte-ignore state_referenced_locally
  const controlled = controlledRemoteValue(tag);
  // svelte-ignore state_referenced_locally
  const events = element.remoteEventDefinitions;

  let node = $state<HTMLElement | undefined>();

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

  const slots = $derived(
    slotNames
      .map((slotName) => ({
        slotName,
        snippet: rest[slotName] as Snippet | undefined,
      }))
      .filter(
        (slot): slot is { slotName: string; snippet: Snippet } =>
          typeof slot.snippet === "function",
      ),
  );

  /**
   * Splits the props into remote properties and event listeners.
   *
   * Nothing is renamed on the way: Svelte hands a component its props with
   * their casing intact, so `isDisabled`, `aria-label` and `data-testid` all
   * arrive spelled the way the element declares them. Only `class` is
   * translated, because that is the attribute a Svelte author writes.
   */
  const readProps = () => {
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
    const target = node;
    if (target) {
      syncElement(target);
    }
  });

  $effect(() => () => {
    for (const [event, applied] of appliedListeners) {
      node?.removeEventListener(event, applied.attached);
    }
    appliedListeners.clear();
  });

  onMount(reportUsage);
</script>

<!--
  Written without whitespace between the parts on purpose: Svelte keeps a text
  node wherever the source has whitespace between two nodes, and in a remote
  tree that text node is mirrored to the host as a child of the component.
-->
<svelte:element
  this={tag}
  bind:this={node}
>{@render children?.()}{#each slots as slot (slot.slotName)}<flr-slot-root-wrapper
      use:slotAttribute={slot.slotName}
    >{@render slot.snippet()}</flr-slot-root-wrapper>{/each}</svelte:element>
