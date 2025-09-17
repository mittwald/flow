import {
  dynamicPropKey,
  type DynamicProp,
  type DynamicPropKey,
} from "@/lib/propsContext/dynamicProps/types";
import type {
  FlowComponentName,
  FlowComponentPropName,
} from "@/components/propTypes";

export const dynamic = <
  C extends FlowComponentName,
  P extends FlowComponentPropName<C>,
>(
  getDynamicProp: DynamicProp<C, P>[DynamicPropKey],
): DynamicProp<C, P> => ({
  [dynamicPropKey]: getDynamicProp,
});

export default dynamic;
