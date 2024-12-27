/// <reference types="vite/client" />
import type React from "react";

// allow forwardRef with generic types
declare module "react" {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.locale.json" {
  import type { LocalizedStrings } from "react-aria";
  const langFile: LocalizedStrings;
  export default langFile;
}
