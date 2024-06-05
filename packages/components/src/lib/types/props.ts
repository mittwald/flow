import type { ExoticComponent, HTMLAttributes, ReactHTML } from "react";

export type Status = "info" | "success" | "warning" | "danger";

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  status?: T;
};

export interface PropsWithTunnel {
  /** @internal */
  tunnelId?: string;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<T extends keyof ReactHTML = never> =
  HTMLAttributes<HTMLElement> & {
    elementType?: T | ExoticComponent;
  };
