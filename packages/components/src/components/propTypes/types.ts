import type { FlowComponentPropsTypes } from "@/components/propTypes/index";

export type FlowComponentName = keyof FlowComponentPropsTypes;

export type FlowComponentProps<C extends FlowComponentName> =
  FlowComponentPropsTypes[C];

export type FlowComponentPropName<C extends FlowComponentName> =
  keyof FlowComponentProps<C>;

export type FlowComponentPropType<
  C extends FlowComponentName,
  P extends FlowComponentPropName<C>,
> = FlowComponentProps<C>[P];
