import { describe, expect, test } from "@jest/globals";
import { FC } from "react";
import useProps from "@/lib/propsContext/useProps";
import React from "react";
import { render, screen } from "@testing-library/react";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import dynamic from "@/lib/propsContext/dynamicProps/dynamic";
import { PropsContext } from "@/lib/propsContext/types";

interface TestComponentProps {
  testProp?: string;
  testDynamicProp?: boolean;
}

declare module "../../components/propTypes" {
  export interface FlowComponentPropsTypes {
    test: TestComponentProps;
  }
}

const ComponentUsingProps: FC<TestComponentProps> = (props) => {
  const { testProp } = useProps("test", props);
  return <span data-testid="prop-value">{testProp ?? "undefined"}</span>;
};

const expectPropertyToBe = (expected: string): void =>
  expect(screen.getByTestId("prop-value").innerHTML).toBe(expected);

const contextProps: PropsContext = {
  test: {
    testProp: "context",
  },
};

test("The local property is returned, if property is not in context", () => {
  render(<ComponentUsingProps testProp="local" />);
  expectPropertyToBe("local");
});

test("The local property is returned, event if property is in context", () => {
  render(
    <PropsContextProvider props={contextProps}>
      <ComponentUsingProps testProp="local" />
    </PropsContextProvider>,
  );
  expectPropertyToBe("local");
});

test("The context property is returned, if property is in context but not local", () => {
  render(
    <PropsContextProvider props={contextProps}>
      <ComponentUsingProps />
    </PropsContextProvider>,
  );
  expectPropertyToBe("context");
});

test("The parent context property is returned, if property is in parent context but not local", () => {
  render(
    <PropsContextProvider props={contextProps}>
      <PropsContextProvider props={{}}>
        <ComponentUsingProps />
      </PropsContextProvider>
    </PropsContextProvider>,
  );
  expectPropertyToBe("context");
});

test("The nearest context property is returned, if property is in parent and child context but not local", () => {
  render(
    <PropsContextProvider props={{ test: { testProp: "context1" } }}>
      <PropsContextProvider props={{ test: { testProp: "context2" } }}>
        <ComponentUsingProps />
      </PropsContextProvider>
    </PropsContextProvider>,
  );
  expectPropertyToBe("context2");
});

describe("Dynamic Props", () => {
  const contextPropsWithDynamic: PropsContext = {
    test: {
      testProp: dynamic((p) =>
        p.testDynamicProp === true ? "Dynamic!" : "Not dynamic...",
      ),
    },
  };

  test("The dynamic context property is returned, if property is in context but not local", () => {
    render(
      <PropsContextProvider props={contextPropsWithDynamic}>
        <ComponentUsingProps testDynamicProp={true} />
      </PropsContextProvider>,
    );
    expectPropertyToBe("Dynamic!");
  });

  test("The dynamic context property is returned, if property is in context but not local (counter check)", () => {
    render(
      <PropsContextProvider props={contextPropsWithDynamic}>
        <ComponentUsingProps testDynamicProp={false} />
      </PropsContextProvider>,
    );
    expectPropertyToBe("Not dynamic...");
  });
});
