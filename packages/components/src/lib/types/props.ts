import type {
  ComponentType,
  ExoticComponent,
  HTMLAttributes,
  ReactHTML,
  ReactNode,
} from "react";

export type Status = "info" | "success" | "warning" | "danger";

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  status?: T;
};

export interface PropsWithTunnel {
  /** @internal */
  tunnelId?: string;
}

export interface PropsWithRender<P> {
  /** @internal */
  render?: ((component: ComponentType<P>, props: P) => ReactNode) | false;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<T extends keyof ReactHTML = never> =
  HTMLAttributes<HTMLElement> & {
    elementType?: T | ExoticComponent;
  };
