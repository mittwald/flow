import type { FC } from "react";
import React, { forwardRef } from "react";
import type { RemoteSimpleInputElement } from "@mittwald/flow-remote-elements";
import type { RemoteComponentPropsFromElementConstructor } from "@remote-dom/react";
import type { RemoteEvent } from "@remote-dom/core/elements";

export type InputProps = RemoteComponentPropsFromElementConstructor<
  typeof RemoteSimpleInputElement
>;

type X = {
  [K in keyof InputProps]: K extends `on${string}`
    ? InputProps[K] extends ((arg: infer Arg) => void) | undefined
      ? (event: RemoteEvent<Arg>) => void
      : InputProps[K]
    : InputProps[K];
};

export const SimpleInput: FC = forwardRef<HTMLInputElement, X>((props, ref) => {
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
