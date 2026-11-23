import { version } from "@/version";
import { useControlledRemoteValueProps } from "@mittwald/flow-react-components/flr-universal";
import { FlowRemoteElement } from "@mittwald/flow-remote-elements";
import { createRemoteComponent as libCreateRemoteComponent } from "@mittwald/remote-dom-react";
import { createElement, useLayoutEffect, useRef } from "react";

const controlledComponentNames: (keyof HTMLElementTagNameMap)[] = [
  "flr-markdown-editor",
  "flr-number-field",
  "flr-password-creation-field",
  "flr-search-field",
  "flr-text-field",
  "flr-text-area",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => unknown;

/**
 * One function per event prop for the element's lifetime, calling the handler
 * of the latest render — as the Vue binding's wrapper does.
 *
 * Remote-dom re-registers a listener whose identity changed, and removing the
 * element's last listener of an event releases the `dispatch` the host holds.
 * An inline handler did that on every render, so a host event fired while a
 * remote render was in flight called a released function and was lost — the
 * last keystroke of a date field, for one.
 */
const useStableEventHandlers = <P extends Record<string, unknown>>(
  props: P,
  eventPropNames: readonly string[],
): P => {
  const latestProps = useRef(props);
  useLayoutEffect(() => {
    latestProps.current = props;
  });

  const stableHandlers = useRef<Map<string, AnyFunction>>(null);
  stableHandlers.current ??= new Map();

  const result: Record<string, unknown> = { ...props };
  for (const name of eventPropNames) {
    if (typeof props[name] !== "function") {
      continue;
    }
    let handler = stableHandlers.current.get(name);
    if (!handler) {
      handler = (...args) =>
        (latestProps.current[name] as AnyFunction | undefined)?.(...args);
      stableHandlers.current.set(name, handler);
    }
    result[name] = handler;
  }
  return result as P;
};

export const createRemoteComponent: typeof libCreateRemoteComponent = (
  name,
  element,
  options,
) => {
  const RemoteComponent = libCreateRemoteComponent(name, element, options);
  const eventPropNames = Object.keys(options?.eventProps ?? {});
  const isControlledComponent = controlledComponentNames.includes(
    name as keyof HTMLElementTagNameMap,
  );

  return (props) => {
    const controlledProps = isControlledComponent
      ? useControlledRemoteValueProps(props)
      : props;

    return createElement(RemoteComponent, {
      [FlowRemoteElement.initializationPropertyName]: true,
      [FlowRemoteElement.versionPropertyName]: version,
      ...useStableEventHandlers(controlledProps, eventPropNames),
    });
  };
};
