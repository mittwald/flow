import { DynamicProp } from "@/lib/propsContext/dynamicProps/types";
import {
  FlowComponentName,
  FlowComponentPropName,
} from "@/components/propTypes";

export function isDynamicProp<
  C extends FlowComponentName,
  P extends FlowComponentPropName<C>,
>(something: unknown): something is DynamicProp<C, P> {
  return (
    !!something && typeof something === "object" && "__dynamicProp" in something
  );
}

export default isDynamicProp;
