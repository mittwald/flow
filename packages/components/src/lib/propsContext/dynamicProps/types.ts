import type {
  FlowComponentName,
  FlowComponentPropName,
  FlowComponentProps,
  FlowComponentPropType,
} from "@/components/propTypes";

export const dynamicPropKey = "___dynamicProp" as const;
export type DynamicPropKey = typeof dynamicPropKey;

export interface DynamicProp<
  C extends FlowComponentName,
  P extends FlowComponentPropName<C>,
> {
  [dynamicPropKey]: (
    localProps: Partial<FlowComponentProps<C>>,
  ) => FlowComponentPropType<C, P>;
}
