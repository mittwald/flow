import type {
  FlowComponentName,
  FlowComponentProps,
} from "@/components/propTypes";
import { propsContextSupportingComponents } from "@/components/propTypes";
import { mergeProps } from "@react-aria/utils";
import { resolveDynamicProps } from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import { useContextProps } from "@/lib/propsContext/propsContext";
import wrapChildrenWithNestedPropsContext from "@/lib/propsContext/nestedPropsContext/wrapChildrenWithNestedPropsContext";
import { omitBy } from "remeda";
import type { PropsContext } from "@/lib/propsContext/types";
import isDynamicProp from "@/lib/propsContext/dynamicProps/isDynamicProp";
import { areChildrenEmpty } from "@/lib/react/areChildrenEmpty";

export const useProps = <C extends FlowComponentName>(
  component: C,
  localProps: FlowComponentProps<C>,
): FlowComponentProps<C> => {
  if ("children" in localProps) {
    if (areChildrenEmpty(localProps.children)) {
      localProps = { ...localProps };
      delete localProps["children"];
    }
  }

  const propsContext = useContextProps();

  const contextProps = propsContext[component] as
    | (FlowComponentProps<C> & PropsContext)
    | undefined;

  const withResolvedDynamicProps = contextProps
    ? resolveDynamicProps(contextProps, localProps)
    : undefined;

  const withNestedPropsContextProvider = contextProps
    ? wrapChildrenWithNestedPropsContext(contextProps, localProps)
    : undefined;

  const withoutNestedAndDynamicProps = contextProps
    ? omitBy<FlowComponentProps<C>>(
        contextProps,
        (value, key) =>
          propsContextSupportingComponents.includes(key as FlowComponentName) ||
          isDynamicProp(value),
      )
    : undefined;

  return mergeProps(
    withoutNestedAndDynamicProps,
    localProps,
    withResolvedDynamicProps,
    withNestedPropsContextProvider,
  ) as FlowComponentProps<C>;
};

export default useProps;
