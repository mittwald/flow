import { PropsWithChildren } from "react";

export function isPropsWithChildren<T>(
  props: T,
): props is PropsWithChildren<T> {
  return (
    !!props &&
    typeof props === "object" &&
    "children" in props &&
    !!props.children
  );
}
