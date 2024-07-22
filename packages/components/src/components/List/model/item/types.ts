import type { ReactNode } from "react";

export type RenderItemFn<T> = (data: T) => ReactNode;
