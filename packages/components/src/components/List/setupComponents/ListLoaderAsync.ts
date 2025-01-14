import type { AsyncDataLoaderShape } from "~/components/List/model/loading/types";
import type { ComponentType } from "react";

type Props<T> = Omit<AsyncDataLoaderShape<T>, "asyncLoader"> & {
  children: AsyncDataLoaderShape<T>["asyncLoader"];
};

export const ListLoaderAsync = <T>(ignoredProps: Props<T>) => null;

export const TypedListLoaderAsync = <T>() =>
  ListLoaderAsync as ComponentType<Props<T>>;
