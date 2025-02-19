import type {
  ComponentProps,
  ComponentType,
  JSXElementConstructor,
} from "react";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type ViewComponent<T extends JSXElementConstructor<any>> = ComponentType<
  ComponentProps<T>
>;
