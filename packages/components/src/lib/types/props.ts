import type {
  ExoticComponent,
  HTMLAttributes,
  ReactElement,
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

export interface PropsWithHOC<P> {
  /** @internal */
  hoc?: (element: ReactNode, props: P) => ReactElement;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<T extends keyof ReactHTML = never> =
  HTMLAttributes<HTMLElement> & {
    elementType?: T | ExoticComponent;
  };
