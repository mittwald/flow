import {
  DependencyList,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import useProps from "@/lib/propsContext/useProps";
import React from "react";
import { render, screen } from "@testing-library/react";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import dynamic from "@/lib/propsContext/dynamicProps/dynamic";
import { PropsContext } from "@/lib/propsContext/types";
import { TestComponentProps } from "@/lib/propsContext/test";
import { beforeEach, describe, expect, test } from "vitest";

let renderCount: number;
let renderedPropHistory: Array<string | undefined>;

const ComponentUsingProps: FC<PropsWithChildren<TestComponentProps>> = (
  props,
) => {
  const { children, testProp } = useProps("TestComponent", props);
  renderCount++;
  renderedPropHistory.push(testProp);
  return (
    <>
      <span data-testid="prop-value">{testProp ?? "undefined"}</span>
      {children}
    </>
  );
};

const expectPropertyToBe = (expected: string): void =>
  expect(screen.getByTestId("prop-value").innerHTML).toBe(expected);

const contextProps: PropsContext = {
  TestComponent: {
    testProp: "context",
  },
};

beforeEach(() => {
  renderCount = 0;
  renderedPropHistory = [];
});

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
    <PropsContextProvider props={{ TestComponent: { testProp: "context1" } }}>
      <PropsContextProvider props={{ TestComponent: { testProp: "context2" } }}>
        <ComponentUsingProps />
      </PropsContextProvider>
    </PropsContextProvider>,
  );
  expectPropertyToBe("context2");
});

describe("Dynamic Props", () => {
  const contextPropsWithDynamic: PropsContext = {
    TestComponent: {
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

describe("Context memoization", () => {
  interface TestSetup {
    getDependencies: () => DependencyList | undefined;
  }

  const runTest = (setup: TestSetup) => {
    const { getDependencies } = setup;

    const ComponentWithStateChange: FC<PropsWithChildren> = (props) => {
      const [state, setState] = useState(0);
      useEffect(() => {
        setState(1);
      }, []);

      // This context should be memoized
      const contextProps: PropsContext = {
        TestComponent: {
          testProp: `state-${state}`,
        },
      };

      return (
        <PropsContextProvider
          props={contextProps}
          dependencies={getDependencies()}
        >
          {props.children}
        </PropsContextProvider>
      );
    };

    render(
      <ComponentWithStateChange>
        <ComponentUsingProps />
      </ComponentWithStateChange>,
    );
  };

  test("Renders only once if dependencies is empty array", () => {
    runTest({
      getDependencies: () => [],
    });
    expect(renderCount).toBe(1);
  });

  test("Renders only once if dependencies is not defined", () => {
    runTest({
      getDependencies: () => undefined,
    });
    expect(renderCount).toBe(1);
  });

  test("Renders again if dependency changes", () => {
    runTest({
      getDependencies: () => [renderCount],
    });
    expect(renderCount).toBe(2);
  });

  test("Context property is memoized if dependency does not change", () => {
    runTest({
      getDependencies: () => [],
    });
    expect(renderedPropHistory).toEqual(["state-0"]);
  });

  test("Context property changes if dependency changes", () => {
    runTest({
      getDependencies: () => [renderCount],
    });
    expect(renderedPropHistory).toEqual(["state-0", "state-1"]);
  });
});

test("Nested context property is used when matching child is rendered", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {
          // TestComponent as child
          TestComponent: { testProp: "nestedContext" },
          testProp: "context",
        },
      }}
    >
      <ComponentUsingProps>
        <ComponentUsingProps />
      </ComponentUsingProps>
    </PropsContextProvider>,
  );
  expect(screen.getAllByTestId("prop-value").map((el) => el.innerText)).toEqual(
    ["context", "nestedContext"],
  );
});

test("Nested context property is used when matching child-array is rendered", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {
          // TestComponent as child
          TestComponent: { testProp: "nestedContext" },
          testProp: "context",
        },
      }}
    >
      <ComponentUsingProps>
        <ComponentUsingProps />
        <ComponentUsingProps />
      </ComponentUsingProps>
    </PropsContextProvider>,
  );
  expect(screen.getAllByTestId("prop-value").map((el) => el.innerText)).toEqual(
    ["context", "nestedContext", "nestedContext"],
  );
});
