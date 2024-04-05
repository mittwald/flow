import type {
  FlowComponentName,
  FlowComponentProps,
} from "@/components/propTypes";
import { mergeProps } from "@react-aria/utils";
import { resolveDynamicProps } from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import { useContext } from "react";
import { propsContext } from "@/lib/propsContext/propsContext";
import wrapChildrenWithNestedPropsContext from "@/lib/propsContext/nestedPropsContext/wrapChildrenWithNestedPropsContext";

export const useProps = <C extends FlowComponentName>(
  component: C,
  localProps: FlowComponentProps<C>,
): FlowComponentProps<C> => {
  const contextProps = useContext(propsContext)[
    component
  ] as FlowComponentProps<C>;

  const resolvedDynamicProps = contextProps
    ? resolveDynamicProps(contextProps, localProps)
    : undefined;

  const withNestedPropsContext = contextProps
    ? wrapChildrenWithNestedPropsContext(contextProps, localProps)
    : undefined;

  return mergeProps(
    contextProps,
    localProps,
    resolvedDynamicProps,
    withNestedPropsContext,
  ) as FlowComponentProps<C>;
};

export default useProps;
