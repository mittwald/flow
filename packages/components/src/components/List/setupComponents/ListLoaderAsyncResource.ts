import type { AsyncResourceFactoryDataLoaderShape } from "~/components/List/model/loading/types";
import type { ComponentType } from "react";

type Props<T> = Omit<
  AsyncResourceFactoryDataLoaderShape<T>,
  "asyncResourceFactory"
> & {
  children: AsyncResourceFactoryDataLoaderShape<T>["asyncResourceFactory"];
};

export const ListLoaderAsyncResource = <T>(ignoredProps: Props<T>) => null;

export const TypedListLoaderAsyncResource = <T>() =>
  ListLoaderAsyncResource as ComponentType<Props<T>>;
