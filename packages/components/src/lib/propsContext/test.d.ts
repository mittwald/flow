export interface TestComponentProps {
  testProp?: string;
  testDynamicProp?: boolean;
}

declare module "../../components/propTypes" {
  export interface FlowComponentPropsTypes {
    test: TestComponentProps;
  }
}
