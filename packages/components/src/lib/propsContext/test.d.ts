import { PropsWithChildren } from "react";

export interface TestComponentProps extends PropsWithChildren {
  testProp?: string;
  testDynamicProp?: boolean;
}

declare module "../../components/propTypes" {
  export interface FlowComponentPropsTypes {
    TestComponent: TestComponentProps;
  }
}
