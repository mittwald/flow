// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyData = any;

export interface ListDataLoaderResult<T> {
  data: T[];
  itemTotalCount?: number;
}
