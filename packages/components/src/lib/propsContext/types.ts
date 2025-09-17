import type {
  FlowComponentName,
  FlowComponentPropName,
  FlowComponentPropType,
} from "@/components/propTypes/types";
import type { DynamicProp } from "./dynamicProps/types";
import type { InheritPropsContextSettings } from "@/lib/propsContext/inherit/types";
import type { NestingLevelProps } from "@/lib/propsContext/nestedPropsContext/types";

export type PropsContext = Partial<{
  [C in FlowComponentName]: ComponentPropsContext<C>;
}> &
  InheritPropsContextSettings &
  NestingLevelProps;

export type ComponentPropsContext<C extends FlowComponentName> = Partial<{
  [P in FlowComponentPropName<C>]:
    | FlowComponentPropType<C, P>
    | DynamicProp<C, P>;
}> &
  PropsContext;

// Prevents TS2590. Maybe later TS version may not have this bug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkaroundType = any;
