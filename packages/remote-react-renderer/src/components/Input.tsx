import type { FC } from "react";
import React, { forwardRef } from "react";
import type { RemoteInputElement } from "@mittwald/flow-remote-elements";
import type { RemoteComponentPropsFromElementConstructor } from "@remote-dom/react";
import type { RemoteEvent } from "@remote-dom/core/elements";

export type InputProps = RemoteComponentPropsFromElementConstructor<
  typeof RemoteInputElement
>;

type X = {
  [K in keyof InputProps]: K extends `on${string}`
    ? InputProps[K] extends ((arg: infer Arg) => void) | undefined
      ? (event: RemoteEvent<Arg>) => void
      : InputProps[K]
    : InputProps[K];
};

export const Input: FC = forwardRef<HTMLInputElement, X>((props, ref) => {
  const {
    children: ignored,
    onFocus,
    onBlur,
    onChange,
    ...rest
  } = props as InputProps;
  return (
    <input
      {...rest}
      ref={ref}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
    />
  );
});
