import {
  FlowComponentName,
  FlowComponentProps,
  FlowComponentPropType,
} from "@/components/propTypes";
import { isDynamicProp } from "@/lib/propsContext/dynamicProps/isDynamicProp";
import { ComponentPropsContext } from "@/lib/propsContext/types";
import { isFlowComponentProp } from "@/lib/propsContext/isFlowComponentProp";

export const resolveDynamicProps = <C extends FlowComponentName>(
  contextProps: ComponentPropsContext<C>,
  localProps: Partial<FlowComponentProps<C>>,
): Partial<FlowComponentProps<C>> => {
  const resolved: Partial<FlowComponentProps<C>> = {};

  for (const prop in contextProps) {
    if (isFlowComponentProp<C>(prop)) {
      const propValue = contextProps[prop] as FlowComponentPropType<
        C,
        typeof prop
      >;

      if (isDynamicProp<C, typeof prop>(propValue)) {
        resolved[prop] = propValue.__dynamicProp(localProps);
      } else {
        resolved[prop] = propValue;
      }
    }
  }

  return resolved as Partial<FlowComponentProps<C>>;
};

export default resolveDynamicProps;
