/** @internal */
export const inheritPropsContextKey = "___inherit" as const;
export const persistentPropsContextKey = "___persistent" as const;

/** @internal */
export type InheritPropsContextKey = typeof inheritPropsContextKey;
export type PersistentPropsContextKey = typeof persistentPropsContextKey;

export interface InheritPropsContextSettings {
  [inheritPropsContextKey]?: boolean;
  [persistentPropsContextKey]?: boolean;
}

export const inheritProps: InheritPropsContextSettings = {
  [inheritPropsContextKey]: true,
  [persistentPropsContextKey]: true,
};

export type PropsContextLevelMode =
  | "reset"
  | "increment"
  | "decrement"
  | "keep";
