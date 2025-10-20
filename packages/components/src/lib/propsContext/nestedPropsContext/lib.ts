import type { PropsContext } from "@/lib/propsContext/types";
import {
  nestingLevelKey,
  type NestingLevelProps,
} from "@/lib/propsContext/nestedPropsContext/types";

export function isNestingProps(
  propsContext: PropsContext,
): propsContext is NestingLevelProps {
  return (
    nestingLevelKey in propsContext &&
    typeof propsContext[nestingLevelKey] === "number"
  );
}

export function isNestingLevelKey(key: string) {
  return key === nestingLevelKey;
}

export const getNestingLevel = (props: PropsContext) => {
  return isNestingProps(props) ? (props[nestingLevelKey] ?? 0) : 0;
};

export const increaseNestingLevel = (propsContext: PropsContext) => {
  const currentNestingLevel = getNestingLevel(propsContext);
  return {
    ...propsContext,
    [nestingLevelKey]: currentNestingLevel + 1,
  };
};
