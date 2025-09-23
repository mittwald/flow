export const inheritPropsContextKey = "___inherit" as const;

export type InheritPropsContextKey = typeof inheritPropsContextKey;

export interface InheritPropsContextSettings {
  [inheritPropsContextKey]?: boolean;
}

export const inheritProps: InheritPropsContextSettings = {
  [inheritPropsContextKey]: true,
};

export type PropsContextLevelMode =
  | "reset"
  | "increment"
  | "decrement"
  | "keep";
