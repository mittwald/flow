import type { FlowComponentName } from "@/components/propTypes";
import type { ExoticComponent, HTMLAttributes } from "react";

export const statusTypes = [
  "info",
  "success",
  "warning",
  "danger",
  "unavailable",
] as const;

export type Status = (typeof statusTypes)[number];

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  /** The elements status */
  status?: T;
};

export interface PropsWithTunnel {
  /** @internal */
  tunnel?: {
    id: string;
    component: FlowComponentName;
  } | null;
}

export interface PropsWithClassName {
  /** The elements class name. */
  className?: string;
}

export type PropsWithElementType<
  T extends keyof HTMLElementTagNameMap = never,
> = HTMLAttributes<HTMLElement> & {
  /** The HTML element or React component rendered as the elements root. */
  elementType?: T | ExoticComponent;
};

export type ContainerBreakpointSize = "xs" | "s" | "m" | "l" | "xl";

export interface PropsWithContainerBreakpointSize {
  /**
   * The breakpoint at which the element switches to its compact layout.
   * Evaluated as a container query against the surrounding container, not
   * against the viewport.
   */
  containerBreakpointSize?: ContainerBreakpointSize;
}

export const alphaColors = [
  "dark",
  "light",
  "dark-static",
  "light-static",
] as const;

export type AlphaColor = (typeof alphaColors)[number];

export function isAlphaColor(color: string): color is AlphaColor {
  return alphaColors.includes(color as AlphaColor);
}
