import type {
  FlowComponentName,
  FlowComponentProps,
} from "@/components/propTypes";
import { propsContextSupportingComponents } from "@/components/propTypes";
import { mergeProps } from "@react-aria/utils";
import { resolveDynamicProps } from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import { useContextProps } from "@/lib/propsContext/propsContext";
import wrapChildrenWithNestedPropsContext from "@/lib/propsContext/nestedPropsContext/wrapChildrenWithNestedPropsContext";
import { omit } from "remeda";
import type { PropsContext } from "@/lib/propsContext/types";

export const useProps = <C extends FlowComponentName>(
  component: C,
  localProps: FlowComponentProps<C>,
): FlowComponentProps<C> => {
  const propsContext = useContextProps();

  const contextProps = propsContext[component] as FlowComponentProps<C> &
    PropsContext;

  const resolvedDynamicProps = contextProps
    ? resolveDynamicProps(contextProps, localProps)
    : undefined;

  const withNestedPropsContext = contextProps
    ? wrapChildrenWithNestedPropsContext(contextProps, localProps)
    : undefined;

  return mergeProps(
    contextProps
      ? omit(contextProps, propsContextSupportingComponents)
      : contextProps,
    localProps,
    resolvedDynamicProps,
    withNestedPropsContext,
  ) as FlowComponentProps<C>;
};

export default useProps;
