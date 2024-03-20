import { AsyncDataLoaderShape } from "@/components/List/model/loading/types";

interface Props<T> extends Omit<AsyncDataLoaderShape<T>, "asyncLoader"> {
  children: AsyncDataLoaderShape<T>["asyncLoader"];
}

export function ListLoaderAsync<T = never>(ignoredProps: Props<T>) {
  return null;
}
