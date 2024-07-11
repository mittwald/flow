import type { ComponentType } from "react";

type Props<T> = {} & {
  data: T[];
};

export const ListStaticData = <T>(ignoredProps: Props<T>) => null;

export const TypedListStaticData = <T>() =>
  ListStaticData as ComponentType<Props<T>>;
