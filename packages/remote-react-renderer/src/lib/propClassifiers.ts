import { isFunction } from "remeda";
import type { EventHandler } from "@mittwald/flow-remote-core";

const defaultEventPropMatcher = /on[A-Z].*/;

export const isEventProp = (
  name: string,
  value: unknown,
): value is EventHandler =>
  !!name.match(defaultEventPropMatcher) && isFunction(value);

export const isStyleProp = (name: string): boolean => name === "style";

export const isReactSuspendedStyle = (value: unknown): boolean =>
  value === "display: none !important;";
