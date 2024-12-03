import type { IsEqual } from "type-fest";

type Filter<KeyType, ExcludeType> =
  IsEqual<KeyType, ExcludeType> extends true
    ? never
    : KeyType extends ExcludeType
      ? never
      : KeyType;

type PickEventHandler<T> = Omit<T, Filter<keyof T, `on${Capitalize<string>}`>>;

type RemoveOnPrefix<T> = T extends `on${infer R}`
  ? R extends Capitalize<R>
    ? Uncapitalize<R>
    : never
  : never;

type RemoveOnPrefixInKeys<T> = {
  [K in keyof T as RemoveOnPrefix<K>]: T[K];
};

export type PickRemoteElementEventListeners<T> = RemoveOnPrefixInKeys<
  PickEventHandler<T>
>;

export type FlowRemoteElementKeysOfTagNameMap<T extends string> =
  | keyof Omit<
      HTMLElementTagNameMap,
      Filter<keyof HTMLElementTagNameMap, `${T}-${string}`>
    >
  | "remote-fragment";
