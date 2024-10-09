import type { ComponentType } from "react";

type Props<T> = {} & {
  data: readonly T[];
};

export const ListStaticData = <T>(ignoredProps: Props<T>) => null;

export const TypedListStaticData = <T>() =>
  ListStaticData as ComponentType<Props<T>>;
