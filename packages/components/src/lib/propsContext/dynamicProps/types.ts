import type {
  FlowComponentName,
  FlowComponentPropName,
  FlowComponentProps,
  FlowComponentPropType,
} from "@/components/propTypes";

export interface DynamicProp<
  C extends FlowComponentName,
  P extends FlowComponentPropName<C>,
> {
  __dynamicProp: (
    localProps: Partial<FlowComponentProps<C>>,
  ) => FlowComponentPropType<C, P>;
}
