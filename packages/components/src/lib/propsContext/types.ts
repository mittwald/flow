import {
  FlowComponentName,
  FlowComponentPropName,
  FlowComponentPropType,
} from "@/components/propTypes";
import { DynamicProp } from "./dynamicProps/types";

export type PropsContext = Partial<{
  [C in FlowComponentName]: ComponentPropsContext<C>;
}>;

export type ComponentPropsContext<C extends FlowComponentName> = Partial<{
  [P in FlowComponentPropName<C>]:
    | FlowComponentPropType<C, P>
    | DynamicProp<C, P>;
}>;
