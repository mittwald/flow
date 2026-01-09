import type { ExoticComponent, HTMLAttributes } from "react";

export type Status = "info" | "success" | "warning" | "danger" | "unavailable";

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  /** The elements status */
  status?: T;
};

export type AlertStatus = Exclude<Status, "unavailable">;

export type PropsWithAlertStatus<
  T extends AlertStatus = AlertStatus,
  P = unknown,
> = P & {
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
