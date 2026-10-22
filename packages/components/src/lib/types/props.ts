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

export type TunnelTarget = {
  id: string;
  component: FlowComponentName;
  /**
   * A stable entry id instead of a generated one. Needed wherever the same
   * component is rendered more than once for a single logical element:
   * react-aria renders collection children twice — once into its hidden
   * collection document, once for real — and a generated id would register each
   * render as its own entry, so the tunnel exit renders every element twice.
   * Must be unique among the siblings of one tunnel.
   */
  staticEntryId?: string;
} | null;

export interface PropsWithTunnel {
  /** @internal */
  tunnel?: TunnelTarget;
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

/** The decorative colors, one per mittwald brand color (#3508). */
export const decorativeColors = [
  "blue",
  "navy",
  "lilac",
  "sage",
  "salmon",
] as const;

export type DecorativeColor = (typeof decorativeColors)[number];

/**
 * Deprecated decorative color values and the color each renders as (#3508).
 * `violet` duplicated `lilac`; `teal` already rendered the sage tone.
 */
export const deprecatedDecorativeColors = {
  violet: "lilac",
  teal: "sage",
} as const satisfies Record<string, DecorativeColor>;

export type DeprecatedDecorativeColor = keyof typeof deprecatedDecorativeColors;
