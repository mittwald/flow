import {
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
  tunnelId?: string;
}

export interface PropsWithHOC<P> {
  hoc?: (element: ReactElement, props: P) => ReactElement;
}

export interface PropsWithClassName {
  className?: string;
}

export type PropsWithElementType<P = unknown> = P &
  HTMLAttributes<HTMLElement> & {
    elementType?: keyof ReactHTML | ExoticComponent;
  };
