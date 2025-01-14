import type {
  FlowComponentName,
  FlowComponentPropName,
} from "~/components/propTypes";
import { isFlowComponentName } from "~/lib/propsContext/isFlowComponentName";

export function isFlowComponentProp<C extends FlowComponentName>(
  something: unknown,
): something is FlowComponentPropName<C> {
  return !isFlowComponentName(something);
}
