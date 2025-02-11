import type {
  FlowComponentName,
  FlowComponentProps,
} from "@/components/propTypes";
import { isDynamicProp } from "@/lib/propsContext/dynamicProps/isDynamicProp";
import type { ComponentPropsContext } from "@/lib/propsContext/types";
import { isFlowComponentProp } from "@/lib/propsContext/isFlowComponentProp";

export const resolveDynamicProps = <C extends FlowComponentName>(
  contextProps: ComponentPropsContext<C>,
  localProps: Partial<FlowComponentProps<C>>,
): Partial<FlowComponentProps<C>> => {
  const resolved: Partial<FlowComponentProps<C>> = {};

  for (const prop in contextProps) {
    if (isFlowComponentProp<C>(prop)) {
      const propValue = contextProps[prop];

      if (isDynamicProp<C, typeof prop>(propValue)) {
        resolved[prop] = propValue.__dynamicProp(localProps);
      }
    }
  }

  return resolved as Partial<FlowComponentProps<C>>;
};

export default resolveDynamicProps;
