import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";
import { pickBy } from "remeda";
import type {
  ComponentPropsContext,
  PropsContext,
  WorkaroundType,
} from "@/lib/propsContext/types";
import type { FlowComponentName } from "@/components/propTypes";

export const pickPropsContext = <C extends FlowComponentName>(
  props: ComponentPropsContext<C>,
): PropsContext =>
  pickBy<WorkaroundType>(props, (_, k) => isFlowComponentName(k));
