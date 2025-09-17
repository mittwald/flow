import type {
  ComponentProps,
  DependencyList,
  FC,
  PropsWithChildren,
} from "react";
import { cloneElement, isValidElement, useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import PropsContextProvider from "@/lib/propsContext/components/PropsContextProvider";
import dynamic from "@/lib/propsContext/dynamicProps/dynamic";
import type { PropsContext } from "@/lib/propsContext/types";
import type { TestComponentProps } from "@/lib/propsContext/test";
import { beforeEach, describe, expect, test } from "vitest";
import { flowComponent } from "@/index/internal";

let renderCount: number;
let renderedPropHistory: (string | undefined)[];

const TestComponent: FC<PropsWithChildren<TestComponentProps>> = flowComponent(
  "TestComponent",
  (props) => {
    const { children, testProp } = props;
    renderCount++;
    renderedPropHistory.push(testProp);
    return (
      <>
        <span data-testid="prop-value">{testProp ?? "undefined"}</span>
        {isValidElement<Record<string, unknown>>(children)
          ? cloneElement(children, {
              ...children.props,
              "data-additional-prop": true,
            })
          : children}
      </>
    );
  },
);

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
  render(<TestComponent testProp="local" />);
  expectPropertyToBe("local");
});

test("The local property is returned, even if property is in context", () => {
  render(
    <PropsContextProvider props={contextProps}>
      <TestComponent testProp="local" />
    </PropsContextProvider>,
  );
  expectPropertyToBe("local");
});

test("The context property is returned, if property is in context but not local", () => {
  render(
    <PropsContextProvider props={contextProps}>
      <TestComponent />
    </PropsContextProvider>,
  );
  expectPropertyToBe("context");
});

test("The parent context property is returned, if property is in parent context but not local", () => {
  render(
    <PropsContextProvider props={contextProps}>
      <PropsContextProvider props={{}}>
        <TestComponent />
      </PropsContextProvider>
    </PropsContextProvider>,
  );
  expectPropertyToBe("context");
});

test("The nearest context property is returned, if property is in parent and child context but not local", () => {
  render(
    <PropsContextProvider props={{ TestComponent: { testProp: "context1" } }}>
      <PropsContextProvider props={{ TestComponent: { testProp: "context2" } }}>
        <TestComponent />
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
        <TestComponent testDynamicProp={true} />
      </PropsContextProvider>,
    );
    expectPropertyToBe("Dynamic!");
  });

  test("The dynamic context property is returned, if property is in context but not local (counter check)", () => {
    render(
      <PropsContextProvider props={contextPropsWithDynamic}>
        <TestComponent testDynamicProp={false} />
      </PropsContextProvider>,
    );
    expectPropertyToBe("Not dynamic...");
  });
});

describe("Context memoization", () => {
  interface TestSetup {
    getDependencies?: () => DependencyList | undefined;
    getTestComponentProps?: () => Partial<ComponentProps<typeof TestComponent>>;
  }

  const runTest = (setup: TestSetup) => {
    const { getDependencies = () => [], getTestComponentProps } = setup;

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

    if (getTestComponentProps) {
      const { rerender } = render(
        <ComponentWithStateChange>
          <TestComponent {...getTestComponentProps()} />
        </ComponentWithStateChange>,
      );
      rerender(
        <ComponentWithStateChange>
          <TestComponent {...getTestComponentProps()} />
        </ComponentWithStateChange>,
      );
    } else {
      render(
        <ComponentWithStateChange>
          <TestComponent />
        </ComponentWithStateChange>,
      );
    }
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

  test("Renders again if local children props changing", () => {
    runTest({
      getTestComponentProps: () => ({ testProp: Math.random().toString() }),
    });
    expect(renderCount).toBe(2);
  });

  test("Renders not again if local children props are not changing", () => {
    runTest({
      //getTestComponentProps: () => ({ testProp: "foo" }),
    });
    expect(renderCount).toBe(1);
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
      <TestComponent>
        <TestComponent />
      </TestComponent>
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
      <TestComponent>
        <TestComponent />
        <TestComponent />
      </TestComponent>
    </PropsContextProvider>,
  );
  expect(screen.getAllByTestId("prop-value").map((el) => el.innerText)).toEqual(
    ["context", "nestedContext", "nestedContext"],
  );
});

test("Children properties are forwarded, when wrapped in nested PropsContextProvider", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {},
      }}
    >
      <TestComponent>
        <div data-testid="inner" />
      </TestComponent>
    </PropsContextProvider>,
  );

  expect(
    screen.getByTestId("inner").getAttribute("data-additional-prop"),
  ).not.toBeNull();
});

test("Null children property will be overwritten by context", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {
          children: <div data-testid="inner" />,
        },
      }}
    >
      <TestComponent>{null}</TestComponent>
    </PropsContextProvider>,
  );

  expect(screen.getByTestId("inner")).toBeDefined();
});

test("Empty children property will be overwritten by context", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {
          children: <div data-testid="inner" />,
        },
      }}
    >
      <TestComponent>{[]}</TestComponent>
    </PropsContextProvider>,
  );

  expect(screen.getByTestId("inner")).toBeDefined();
});

test("Null array children property will be overwritten by context", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {
          children: <div data-testid="inner" />,
        },
      }}
    >
      <TestComponent>{[null, undefined]}</TestComponent>
    </PropsContextProvider>,
  );

  expect(screen.getByTestId("inner")).toBeDefined();
});
