import { HTMLAttributes, ReactHTML } from "react";

export type Status = "info" | "success" | "warning" | "danger";

export type PropsWithStatus<T extends Status = Status, P = unknown> = P & {
  status?: T;
};

export type PropsWithElementType<P = unknown> = P &
  HTMLAttributes<HTMLElement> & {
    elementType?: keyof ReactHTML;
  };
