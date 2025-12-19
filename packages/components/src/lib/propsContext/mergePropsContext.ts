import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";
import type { PropsContext, WorkaroundType } from "@/lib/propsContext/types";
import { getPropsMerger } from "@/lib/react/getPropsMerger";

const merger = getPropsMerger({
  mergeClassNames: false,
  mergeEventHandler: true,
});

export const mergePropsContext = (
  firstContext: PropsContext = {},
  secondContext: PropsContext = {},
): PropsContext => {
  const mergedComponentNames = Object.keys({
    ...firstContext,
    ...secondContext,
  }).filter(isFlowComponentName);

  return Object.fromEntries(
    mergedComponentNames.map((componentName) => [
      componentName,
      merger<WorkaroundType>(
        firstContext[componentName],
        secondContext[componentName],
      ),
    ]),
  );
};

export default mergePropsContext;
