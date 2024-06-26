import type { FlowComponentName } from "@/components/propTypes";
import type { PropsContext, WorkaroundType } from "@/lib/propsContext/types";
import { getPropsMerger } from "@/lib/react/getPropsMerger";

const merger = getPropsMerger({
  mergeClassNames: false,
  mergeEventHandler: false,
});

export const mergePropsContext = (
  firstContext: PropsContext = {},
  secondContext: PropsContext = {},
): PropsContext => {
  const mergedComponentNames = Object.keys({
    ...firstContext,
    ...secondContext,
  }) as FlowComponentName[];

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
