/** @internal */
export const inheritPropsContextKey = "___inherit" as const;

/** @internal */
export type InheritPropsContextKey = typeof inheritPropsContextKey;

export interface InheritPropsContextSettings {
  [inheritPropsContextKey]?: boolean | "persistent";
}

export const inheritProps: InheritPropsContextSettings = {
  [inheritPropsContextKey]: true,
};

export type PropsContextLevelMode =
  | "reset"
  | "increment"
  | "decrement"
  | "keep";
