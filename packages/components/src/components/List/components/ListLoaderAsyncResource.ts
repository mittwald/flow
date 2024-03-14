import { AsyncResourceFactoryDataLoaderShape } from "@/components/List/model/loading/types";

interface Props<T>
  extends Omit<AsyncResourceFactoryDataLoaderShape<T>, "asyncResourceFactory"> {
  children: AsyncResourceFactoryDataLoaderShape<T>["asyncResourceFactory"];
}

export function ListLoaderAsyncResource<T = never>(ignoredProps: Props<T>) {
  return null;
}
