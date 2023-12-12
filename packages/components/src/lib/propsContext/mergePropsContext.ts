import { mergeProps } from "@react-aria/utils";
import { FlowComponentName } from "@/components/propTypes";
import { PropsContext } from "@/lib/propsContext";

export const mergePropsContext = (
  firstContext: PropsContext,
  secondContext: PropsContext,
): PropsContext => {
  const mergedComponentNames = Object.keys({
    ...firstContext,
    ...secondContext,
  }) as FlowComponentName[];

  return Object.fromEntries(
    mergedComponentNames.map((componentName) => [
      componentName,
      mergeProps(firstContext[componentName], secondContext[componentName]),
    ]),
  );
};

export default mergePropsContext;
