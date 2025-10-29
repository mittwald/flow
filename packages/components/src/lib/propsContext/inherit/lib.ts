import {
  inheritPropsContextKey,
  type InheritPropsContextSettings,
  type PropsContextLevelMode,
} from "@/lib/propsContext/inherit/types";
import type { PropsContext as PropsContextShape } from "@/lib/propsContext";
import type { FlowComponentName } from "@/components/propTypes";

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

export const filterPersistentContextEntries = (
  currentPropsContext: PropsContextShape,
): Partial<PropsContextShape> => {
  const resultPropsContext: Partial<PropsContextShape> = {};

  for (const [key, value] of Object.entries(currentPropsContext)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      value.___persistent
    ) {
      resultPropsContext[key as FlowComponentName] = value;
    }
  }

  return resultPropsContext;
};
