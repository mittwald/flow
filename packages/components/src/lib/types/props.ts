import type { ExoticComponent, HTMLAttributes } from "react";

export type Status = "info" | "success" | "warning" | "danger";

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  /** The elements status */
  status?: T;
};

export interface PropsWithTunnel {
  /** @internal */
  tunnelId?: string | null;
}

export interface PropsWithClassName {
  /** The elements class name. */
  className?: string;
}

export type PropsWithElementType<
  T extends keyof HTMLElementTagNameMap = never,
> = HTMLAttributes<HTMLElement> & {
  elementType?: T | ExoticComponent;
};

export type ContainerBreakpointSize = "xs" | "s" | "m" | "l" | "xl";

export interface PropsWithContainerBreakpointSize {
  containerBreakpointSize?: ContainerBreakpointSize;
}

export const alphaColors = [
  "dark",
  "light",
  "static-dark",
  "static-light",
] as const;

export type AlphaColor = (typeof alphaColors)[number];

export function isAlphaColor(color: string): color is AlphaColor {
  return alphaColors.includes(color as AlphaColor);
}
