import type { ReactNode } from "react";
import type List from "../List";

export type RenderItemFn<T> = (data: T, list: List<T>) => ReactNode;
