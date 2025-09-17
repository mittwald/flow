import {
  inheritPropsContextKey,
  type InheritPropsContextSettings,
  type PropsContextLevelMode,
} from "@/lib/propsContext/inherit/types";

export function isMaxRecursionLevelProp(
  something: unknown,
): something is InheritPropsContextSettings {
  return (
    !!something &&
    typeof something === "object" &&
    inheritPropsContextKey in something
  );
}

export const getMaxRecursionLevel = (props: unknown) => {
  if (isMaxRecursionLevelProp(props)) {
    return props[inheritPropsContextKey] === true ? Infinity : 0;
  }
  return 0;
};

export const isInheritedPropsContextKey = (key: unknown) =>
  key === inheritPropsContextKey;

export const getLevelAfterModeApplied = (
  currentLevel: number,
  mode: PropsContextLevelMode,
) => {
  switch (mode) {
    case "increment":
      return currentLevel + 1;
    case "decrement":
      return currentLevel - 1;
    case "reset":
      return 0;
    case "keep":
    default:
      return currentLevel;
  }
};
