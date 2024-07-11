export type ItemType<T> = T extends (infer TItem)[] ? TItem : T;
