import type { HooksDataLoaderShape } from "@/components/List/model/loading/types";
import type { ComponentType } from "react";

type Props<T> = Omit<HooksDataLoaderShape<T>, "useData"> & {
  children: HooksDataLoaderShape<T>["useData"];
};

export const ListLoaderHooks = <T>(ignoredProps: Props<T>) => null;

export const TypedListLoaderHooks = <T>() =>
  ListLoaderHooks as ComponentType<Props<T>>;
