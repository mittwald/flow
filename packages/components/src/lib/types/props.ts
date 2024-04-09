import type {
  ExoticComponent,
  HTMLAttributes,
  ReactElement,
  ReactHTML,
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
  hoc?: (element: ReactElement, props: P) => ReactElement;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<P = unknown> = P &
  HTMLAttributes<HTMLElement> & {
    elementType?: keyof ReactHTML | ExoticComponent;
  };
