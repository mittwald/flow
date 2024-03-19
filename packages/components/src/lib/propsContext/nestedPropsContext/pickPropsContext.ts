import { PropsContext } from "@/lib/propsContext";
import { isFlowComponentName } from "@/lib/propsContext/isFlowComponentName";
import { pickBy } from "remeda";
import {
  ComponentPropsContext,
  WorkaroundType,
} from "@/lib/propsContext/types";
import { FlowComponentName } from "@/components/propTypes";

export const pickPropsContext = <C extends FlowComponentName>(
  props: ComponentPropsContext<C>,
): PropsContext =>
  pickBy<WorkaroundType>(props, (_, k) => isFlowComponentName(k));
