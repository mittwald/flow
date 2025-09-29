import {
  type FlowComponentName,
  type FlowComponentProps,
} from "@/components/propTypes";
import { mergeProps } from "@react-aria/utils";
import { resolveDynamicProps } from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import { useComponentPropsContext } from "@/lib/propsContext/propsContext";
import { omitBy } from "remeda";
import isDynamicProp from "@/lib/propsContext/dynamicProps/lib";
import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";
import { isInheritedPropsContextKey } from "@/lib/propsContext/inherit/lib";
import { areChildrenEmpty } from "@/lib/react/areChildrenEmpty";
import { isNestingLevelKey } from "@/lib/propsContext/nestedPropsContext/lib";

const withoutChildren = <C extends FlowComponentName>(
  props: FlowComponentProps<C>,
) => {
  if ("children" in props) {
    if (areChildrenEmpty(props.children)) {
      const { children: ignored, ...rest } = props;
      return rest as FlowComponentProps<C>;
    }
  }
  return props;
};

export const useProps = <C extends FlowComponentName>(
  component: C,
  localProps: FlowComponentProps<C>,
): FlowComponentProps<C> => {
  localProps = withoutChildren(localProps);

  const componentPropsContext = useComponentPropsContext(component);

  const withResolvedDynamicProps = componentPropsContext
    ? resolveDynamicProps(componentPropsContext, localProps)
    : undefined;

  const withoutInternalProps = componentPropsContext
    ? omitBy(
        componentPropsContext,
        (value, key) =>
          isFlowComponentName(key) ||
          isInheritedPropsContextKey(key) ||
          isNestingLevelKey(key) ||
          isDynamicProp(value),
      )
    : undefined;

  return mergeProps(
    withoutInternalProps,
    localProps,
    withResolvedDynamicProps,
  ) as FlowComponentProps<C>;
};

export default useProps;
