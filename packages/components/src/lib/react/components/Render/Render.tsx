import type { ReactNode } from "react";

type RenderFn<P = never> = (props: P) => ReactNode | void;

export type ReactNodeWithRenderFn<P = never> = RenderFn<P> | ReactNode;

export interface PropsWithRenderChildren<P = never> {
  children: ReactNodeWithRenderFn<P>;
}

export type RenderProps<P = never> = PropsWithRenderChildren<P> &
  (P extends object ? { renderProps: P } : unknown);

export function assertNoRenderFn<P = never>(
  children: ReactNode | RenderFn<P>,
): asserts children is ReactNode {
  if (typeof children === "function") {
    throw new Error("Render functions as children is not supported here.");
  }
}

export function Render<P = unknown>(props: RenderProps<P>) {
  const { children } = props;

  const renderProps = "renderProps" in props ? props.renderProps : undefined;

  if (typeof children === "function") {
    return <>{children(renderProps as P)}</>;
  }

  return <>{children}</>;
}
