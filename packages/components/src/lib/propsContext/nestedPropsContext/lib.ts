import type { PropsContext } from "@/lib/propsContext/types";
import {
  nestingLevelKey,
  type NestingLevelProps,
} from "@/lib/propsContext/nestedPropsContext/types";
import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";

export function isNestingProps(
  propsContext: unknown,
): propsContext is NestingLevelProps {
  return (
    !!propsContext &&
    typeof propsContext === "object" &&
    nestingLevelKey in propsContext &&
    typeof propsContext[nestingLevelKey] === "number"
  );
}

export function isNestingLevelKey(key: string) {
  return key === nestingLevelKey;
}

export const getNestingLevel = (props: unknown) => {
  return isNestingProps(props) ? (props[nestingLevelKey] ?? 0) : 0;
};

export const addNestingLevel = (
  propsContext: PropsContext,
  currentLevel = 0,
) => {
  const withNestingLevel: PropsContext = {
    ...propsContext,
  };

  for (const [key, value] of Object.entries(propsContext)) {
    if (isFlowComponentName(key) && !isNestingProps(value)) {
      withNestingLevel[key] = {
        ...addNestingLevel(value, currentLevel + 1),
        [nestingLevelKey]: currentLevel,
      };
    }
  }

  return withNestingLevel;
};
