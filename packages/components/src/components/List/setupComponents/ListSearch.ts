import type {
  SearchFieldRenderComponent,
  SearchShape,
} from "@/components/List/model/search/types";
import type { ComponentType } from "react";

type Props<T> = Omit<SearchShape<T>, "render" | "textFieldProps"> & {
  children?: SearchFieldRenderComponent;
  autoSubmit?: boolean;
} & SearchShape<T>["textFieldProps"];

export function ListSearch<T = never>(ignoredProps: Props<T>) {
  return null;
}

export const TypedListSearch = <T>() => ListSearch as ComponentType<Props<T>>;
