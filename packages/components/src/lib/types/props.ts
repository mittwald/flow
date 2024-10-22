import type { ExoticComponent, HTMLAttributes, ReactHTML } from "react";

export type Status = "info" | "success" | "warning" | "danger";

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  status?: T;
};

export interface PropsWithTunnel {
  /** @internal */
  tunnelId?: string | null;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<T extends keyof ReactHTML = never> =
  HTMLAttributes<HTMLElement> & {
    elementType?: T | ExoticComponent;
  };

export type ContainerBreakpointSize = "xs" | "s" | "m" | "l" | "xl";

export interface PropsWithContainerBreakpointSize {
  containerBreakpointSize?: ContainerBreakpointSize;
}
