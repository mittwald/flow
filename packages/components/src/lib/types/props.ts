import { HTMLAttributes, ReactHTML } from "react";

export type Variant = "info" | "success" | "warning" | "danger";

export type PropsWithVariant<T extends Variant = Variant, P = unknown> = P & {
  variant?: T;
};

export type PropsWithElementType<P = unknown> = P &
  HTMLAttributes<HTMLElement> & {
    elementType?: keyof ReactHTML;
  };
