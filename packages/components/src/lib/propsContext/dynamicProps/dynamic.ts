import type { DynamicProp } from "@/lib/propsContext/dynamicProps/types";
import type {
  FlowComponentName,
  FlowComponentPropName,
} from "@/components/propTypes";

export const dynamic = <
  C extends FlowComponentName,
  P extends FlowComponentPropName<C>,
>(
  getDynamicProp: DynamicProp<C, P>["__dynamicProp"],
): DynamicProp<C, P> => ({
  __dynamicProp: getDynamicProp,
});

export default dynamic;
