import { ComponentPropsWithoutRef, JSX } from "react";

export type Variant = "info" | "success" | "warning" | "danger";

export type PropsWithVariant<T extends Variant = Variant, P = unknown> = P & {
  variant?: T;
};

export type PropsWithElementType<
  T extends keyof JSX.IntrinsicElements,
  P = unknown,
> = P &
  ComponentPropsWithoutRef<T> & {
    elementType?: keyof JSX.IntrinsicElements;
  };
