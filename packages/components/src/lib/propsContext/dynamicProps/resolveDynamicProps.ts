import { FlowComponentName, FlowComponentProps } from "@/components/propTypes";
import { isDynamicProp } from "@/lib/propsContext/dynamicProps/isDynamicProp";
import { ComponentPropsContext } from "@/lib/propsContext/types";

export const resolveDynamicProps = <C extends FlowComponentName>(
  contextProps: ComponentPropsContext<C>,
  localProps: FlowComponentProps<C>,
): Partial<FlowComponentProps<C>> => {
  const resolved = {
    ...contextProps,
  };

  for (const prop in resolved) {
    const propValue = contextProps[prop];
    if (isDynamicProp<C, typeof prop>(propValue)) {
      resolved[prop] = propValue.__dynamicProp(localProps);
    }
  }

  return resolved as Partial<FlowComponentProps<C>>;
};

export default resolveDynamicProps;
