import type {
  ComponentProps,
  DependencyList,
  FC,
  PropsWithChildren,
} from "react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import PropsContextProvider from "@/lib/propsContext/components/PropsContextProvider";
import dynamic from "@/lib/propsContext/dynamicProps/dynamic";
import type { PropsContext } from "@/lib/propsContext/types";
import type { TestComponentProps } from "@/lib/propsContext/test";
import { beforeEach, describe, expect, test } from "vitest";
import { flowComponent } from "@/index/internal";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

let renderedPropHistory: (string | undefined)[];

const expectRenderCount = (count: number) =>
  expect(page.getByTestId("render-count")).toHaveTextContent(String(count));

const TestComponent: FC<PropsWithChildren<TestComponentProps>> = flowComponent(
  "TestComponent",
  (props) => {
    const { children, testProp, renderCount: renderCountFromProps } = props;
    const localRenderCount = useRef(0);
    const renderCount = renderCountFromProps ?? localRenderCount;
    renderCount.current++;
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
        <span data-testid="render-count">{renderCount.current}</span>
      </>
    );
  },
);

const expectPropertyToBe = (expected: string) =>
  expect(page.getByTestId("prop-value")).toContainHTML(expected);

const contextProps: PropsContext = {
  TestComponent: {
    testProp: "context",
  },
};

beforeEach(() => {
  renderedPropHistory = [];
});

test("The local property is returned, if property is not in context", async () => {
  await render(<TestComponent testProp="local" />);
  expectPropertyToBe("local");
});

test("The local property is returned, even if property is in context", async () => {
  await render(
    <PropsContextProvider props={contextProps}>
      <TestComponent testProp="local" />
    </PropsContextProvider>,
  );
  expectPropertyToBe("local");
});

test("The context property is returned, if property is in context but not local", async () => {
  await render(
    <PropsContextProvider props={contextProps}>
      <TestComponent />
    </PropsContextProvider>,
  );
  expectPropertyToBe("context");
});

test("The parent context property is returned, if property is in parent context but not local", async () => {
  await render(
    <PropsContextProvider props={contextProps}>
      <PropsContextProvider props={{}}>
        <TestComponent />
      </PropsContextProvider>
    </PropsContextProvider>,
  );
  expectPropertyToBe("context");
});

test("The nearest context property is returned, if property is in parent and child context but not local", async () => {
  await render(
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

  test("The dynamic context property is returned, if property is in context but not local", async () => {
    await render(
      <PropsContextProvider props={contextPropsWithDynamic}>
        <TestComponent testDynamicProp={true} />
      </PropsContextProvider>,
    );
    expectPropertyToBe("Dynamic!");
  });

  test("The dynamic context property is returned, if property is in context but not local (counter check)", async () => {
    await render(
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

  const runTest = async (setup: TestSetup) => {
    const { getDependencies = () => [], getTestComponentProps } = setup;
    const renderCount = {
      current: 0,
    };

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
      const { rerender } = await render(
        <ComponentWithStateChange>
          <TestComponent
            {...getTestComponentProps()}
            renderCount={renderCount}
          />
        </ComponentWithStateChange>,
      );
      await rerender(
        <ComponentWithStateChange>
          <TestComponent
            {...getTestComponentProps()}
            renderCount={renderCount}
          />
        </ComponentWithStateChange>,
      );
    } else {
      await render(
        <ComponentWithStateChange>
          <TestComponent renderCount={renderCount} />
        </ComponentWithStateChange>,
      );
    }
  };

  test("Renders only once if dependencies is empty array", async () => {
    await runTest({
      getDependencies: () => [],
    });
    expectRenderCount(1);
  });

  test("Renders only once if dependencies is not defined", async () => {
    await runTest({
      getDependencies: () => undefined,
    });
    expectRenderCount(1);
  });

  test("Renders again if dependency changes", async () => {
    await runTest({
      getDependencies: () => [Math.random()],
    });
    expectRenderCount(2);
  });

  test("Renders again if local children props changing", async () => {
    await runTest({
      getTestComponentProps: () => ({ testProp: Math.random().toString() }),
    });
    expectRenderCount(2);
  });

  test("Renders not again if local children props are not changing", async () => {
    await runTest({
      //getTestComponentProps: () => ({ testProp: "foo" }),
    });
    expectRenderCount(1);
  });

  test("Context property is memoized if dependency does not change", async () => {
    await runTest({
      getDependencies: () => [],
    });
    expect(renderedPropHistory).toEqual(["state-0"]);
  });

  test("Context property changes if dependency changes", async () => {
    await runTest({
      getDependencies: () => [Math.random()],
    });
    expect(renderedPropHistory).toEqual(["state-0", "state-1"]);
  });
});

test("Nested context property is used when matching child is rendered", async () => {
  await render(
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

  const valueElements = page.getByTestId("prop-value");
  expect(valueElements.nth(0)).toHaveTextContent("context");
  expect(valueElements.nth(1)).toHaveTextContent("nestedContext");
});

test("Nested context property is used when matching child-array is rendered", async () => {
  await render(
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

  const valueElements = page.getByTestId("prop-value");
  expect(valueElements.nth(0)).toHaveTextContent("context");
  expect(valueElements.nth(1)).toHaveTextContent("nestedContext");
  expect(valueElements.nth(2)).toHaveTextContent("nestedContext");
});

test("Children properties are forwarded, when wrapped in nested PropsContextProvider", async () => {
  await render(
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

  expect(page.getByTestId("inner")).toHaveAttribute(
    "data-additional-prop",
    "true",
  );
});

test("Null children property will be overwritten by context", async () => {
  await render(
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

  expect(page.getByTestId("inner")).toBeInTheDocument();
});

test("Empty children property will be overwritten by context", async () => {
  await render(
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

  expect(page.getByTestId("inner")).toBeInTheDocument();
});

test("Null array children property will be overwritten by context", async () => {
  await render(
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

  expect(page.getByTestId("inner")).toBeInTheDocument();
});
