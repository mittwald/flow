import type { AsyncResourceFactoryDataLoaderShape } from "@/components/List/model/loading/types";
import type { ComponentType } from "react";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

type Props<T> = Omit<
  AsyncResourceFactoryDataLoaderShape<T>,
  "asyncResourceFactory"
> & {
  children: AsyncResourceFactoryDataLoaderShape<T>["asyncResourceFactory"];
};

/** @deprecated Use ListLoaderHooks instead */
export const ListLoaderAsyncResource = <T>(ignoredProps: Props<T>) => {
  const warnDeprecation = useWarnDeprecation();
  warnDeprecation(
    "The 'ListLoaderAsyncResource' component is deprecated and will be removed in a future release. Use 'ListLoaderHooks' instead.",
  );

  return null;
};

export const TypedListLoaderAsyncResource = <T>() =>
  ListLoaderAsyncResource as ComponentType<Props<T>>;
