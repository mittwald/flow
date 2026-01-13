import type { PropsWithChildren, RefObject } from "react";

export interface TestComponentProps extends PropsWithChildren {
  testProp?: string;
  testDynamicProp?: boolean;
  renderCount?: RefObject<number>;
}

declare module "../../components/propTypes" {
  export interface FlowComponentPropsTypes {
    TestComponent: TestComponentProps;
  }
}
