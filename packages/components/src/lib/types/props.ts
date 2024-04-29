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

export type FlowRenderFn<P> = (
  component: ComponentType<P>,
  props: P,
) => ReactNode;

export interface PropsWithRender<P> {
  /** @internal */
  render?: FlowRenderFn<P> | false;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<T extends keyof ReactHTML = never> =
  HTMLAttributes<HTMLElement> & {
    elementType?: T | ExoticComponent;
  };
