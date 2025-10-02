import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";
import { getMaxRecursionLevel } from "@/lib/propsContext/inherit/lib";
import { getNestingLevel } from "@/lib/propsContext/nestedPropsContext/lib";
import { nestingLevelKey } from "@/lib/propsContext/nestedPropsContext/types";
import {
  type PropsContext,
  type WorkaroundType,
} from "@/lib/propsContext/types";
import { getPropsMerger } from "@/lib/react/getPropsMerger";

const merger = getPropsMerger({
  mergeClassNames: true,
  mergeEventHandler: false,
});

export const mergePropsContext = (
  parentContext: PropsContext = {},
  context: PropsContext = {},
  currentLevel = 0,
): PropsContext => {
  const mergedComponentNames = Object.keys({
    ...parentContext,
    ...context,
  }).filter(isFlowComponentName);

  const parentContextNestingLevel = getNestingLevel(parentContext);
  const contextNestingLevel = getNestingLevel(context);

  const mergedComponentEntries = mergedComponentNames
    .map((componentName) => {
      const componentContextOfParent = parentContext[componentName];
      const componentContext = context[componentName];

      if (!componentContextOfParent && !componentContext) {
        return;
      }

      const parentMaxRecursionLevel = getMaxRecursionLevel(
        componentContextOfParent,
      );

      if (currentLevel > parentMaxRecursionLevel) {
        if (!componentContext) {
          return;
        }
        return [componentName, componentContext];
      }

      const merged =
        parentContextNestingLevel > contextNestingLevel
          ? merger<WorkaroundType>(componentContext, componentContextOfParent)
          : merger<WorkaroundType>(componentContextOfParent, componentContext);

      return [componentName, merged];
    })
    .filter((e) => e !== undefined);

  return Object.fromEntries([
    ...mergedComponentEntries,
    [nestingLevelKey, Math.max(parentContextNestingLevel, contextNestingLevel)],
  ]) as PropsContext;
};

export default mergePropsContext;
