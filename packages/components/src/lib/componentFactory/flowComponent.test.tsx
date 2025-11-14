import { expectTypeOf, test, vitest } from "vitest";
import {
  flowComponent,
  type FlowComponentProps,
  type FlowComponentProvisionType,
} from "@/lib/componentFactory/flowComponent";
import type { ComponentType, PropsWithChildren, ReactElement } from "react";
import { render } from "@testing-library/react";
import { HTMLDivElement as HappyHTMLDivElement } from "happy-dom";
import type { FlowComponentName } from "@/components/propTypes";
import { propsContextSupportingComponents } from "@/components/propTypes";
import { PropsContextProvider } from "@/lib/propsContext/components/PropsContextProvider";

const getComponentName = (name: string): FlowComponentName => {
  propsContextSupportingComponents.push(name as FlowComponentName);
  return name as FlowComponentName;
};

const testComponent1Name = getComponentName("Test1");
const testComponent2Name = getComponentName("Test2");

type TestComponentProps = FlowComponentProps<HTMLIFrameElement> &
  PropsWithChildren<{
    prop?: string;
    otherProp?: string;
  }>;

type TestComponent = ComponentType<TestComponentProps>;

const TestComponent1 = flowComponent(testComponent1Name, (p) => {
  const props = p as TestComponentProps;
  return (
    <div data-testid="test1" ref={props.ref}>
      {props.prop && <div data-testid="prop">{props.prop}</div>}
      {props.otherProp && <div data-testid="otherProp">{props.otherProp}</div>}
      {props.children && <div data-testid="children1">{props.children}</div>}
    </div>
  );
}) as TestComponent;

const TestComponent2 = flowComponent(testComponent2Name, (p) => {
  const props = p as TestComponentProps;
  return (
    <div data-testid="test2" ref={props.ref}>
      {props.prop && <div data-testid="prop">{props.prop}</div>}
      {props.otherProp && <div data-testid="otherProp">{props.otherProp}</div>}
      {props.children && <div data-testid="children2">{props.children}</div>}
    </div>
  );
}) as TestComponent;

test("ref is forwarded to component", () => {
  const ref = vitest.fn();
  render(<TestComponent1 ref={ref} />);
  const refArg = ref.mock.calls[0]?.[0];
  expectTypeOf(refArg).toMatchTypeOf(HappyHTMLDivElement);
});

describe("propsContext", () => {
  test("prop is taken from context", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            prop: "foo",
          },
        }}
      >
        <TestComponent1 />
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">foo</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("local prop overrides prop from context", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            prop: "foo",
          },
        }}
      >
        <TestComponent1 prop="bar" />
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">bar</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("inner context prop overrides prop from outer context", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent2Name]: {
            prop: "foo",
          },
        }}
      >
        <TestComponent1>
          <PropsContextProvider
            props={{
              [testComponent2Name]: {
                prop: "bar",
              },
            }}
          >
            <TestComponent2 />
          </PropsContextProvider>
        </TestComponent1>
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="children1">
          <div data-testid="test2">
            <div data-testid="prop">bar</div>
          </div>
        </div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("prop is NOT taken from outer context", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent2Name]: {
            prop: "foo",
          },
        }}
      >
        <TestComponent1>
          <PropsContextProvider props={{}}>
            <TestComponent2 />
          </PropsContextProvider>
        </TestComponent1>
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="children1">
          <div data-testid="test2" />
        </div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("child component context can be used to set props", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            [testComponent2Name]: {
              prop: "foo",
            },
          },
        }}
      >
        <TestComponent1>
          <TestComponent2 />
        </TestComponent1>
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="children1">
          <div data-testid="test2">
            <div data-testid="prop">foo</div>
          </div>
        </div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("parent context with higher nesting level overrides child context", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            [testComponent2Name]: {
              prop: "foo",
            },
          },
        }}
      >
        <TestComponent1>
          <PropsContextProvider
            props={{
              [testComponent2Name]: {
                prop: "bar",
              },
            }}
          >
            <TestComponent2 />
          </PropsContextProvider>
        </TestComponent1>
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="children1">
          <div data-testid="test2">
            <div data-testid="prop">foo</div>
          </div>
        </div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  type TestComponentProps = Record<string, unknown>;

  interface TestCase {
    localProps?: TestComponentProps;
    expectedProps?: TestComponentProps;
    propsContext?: TestComponentProps;
    type?: FlowComponentProvisionType;
  }

  test.each<[string, ...TestCase[]]>([
    [
      "localprop is used when no context is provided",
      {
        localProps: { prop: "foo" },
        expectedProps: { prop: "foo" },
      },
    ],
    [
      "localprop is used when no context is provided (2 components)",
      {},
      {
        localProps: { prop: "child" },
        expectedProps: { prop: "child" },
      },
    ],
    [
      "component prop is taken from context",
      {
        propsContext: {
          C2: {
            prop: "parent",
          },
        },
      },
      {
        expectedProps: { prop: "parent" },
      },
    ],
    [
      "localprop overrides prop from context",
      {
        propsContext: {
          C2: {
            prop: "parent",
          },
        },
      },
      {
        localProps: { prop: "child" },
        expectedProps: { prop: "child" },
      },
    ],
    [
      "props context is cleared by intermediate UI components",
      {
        propsContext: {
          C3: {
            prop: "parent",
          },
        },
      },
      {
        type: "ui", // intermediate component is ui component
      },
      {
        expectedProps: {},
      },
    ],
    [
      "props context is NOT cleared by intermediate layout component",
      {
        propsContext: {
          C3: {
            prop: "parent",
          },
        },
      },
      {
        type: "layout", // intermediate component is layout component
      },
      {
        expectedProps: {
          prop: "parent",
        },
      },
    ],
    [
      "props context is NOT cleared by intermediate layout component (even with multiple layout components)",
      {
        propsContext: {
          C4: {
            prop: "parent",
          },
        },
      },
      {
        type: "layout", // intermediate component is layout component
      },
      {
        type: "layout", // intermediate component is layout component
      },
      {
        expectedProps: {
          prop: "parent",
        },
      },
    ],
    [
      "nested props context can 'pass' props through UI component, if structure matches",
      {
        propsContext: {
          C2: {
            C3: {
              prop: "parent",
            },
          },
        },
      },
      {
        type: "ui", // intermediate component is ui component
      },
      {
        expectedProps: {
          prop: "parent",
        },
      },
    ],
    [
      "nested props context can 'pass' props through UI component, if structure matches (even with layout component in between)",
      {
        propsContext: {
          C2: {
            C4: {
              prop: "parent",
            },
          },
        },
      },
      {
        type: "ui", // intermediate component is ui component
      },
      {
        type: "layout", // intermediate component is layout component
      },
      {
        expectedProps: {
          prop: "parent",
        },
      },
    ],
    [
      "nested props context can 'pass' props through UI component, if structure matches (even with layout component in between, reversed order)",
      {
        propsContext: {
          C3: {
            C4: {
              prop: "parent",
            },
          },
        },
      },
      {
        type: "layout", // intermediate component is layout component
      },
      {
        type: "ui", // intermediate component is ui component
      },
      {
        expectedProps: {
          prop: "parent",
        },
      },
    ],
    [
      "nested props context can NOT 'pass' props through UI component, if structure does not match UI components",
      {
        propsContext: {
          C2: {
            C4: {
              prop: "parent",
            },
          },
        },
      },
      {
        type: "layout", // intermediate component is layout component
      },
      {
        type: "ui", // intermediate component is ui component
      },
      {
        expectedProps: {},
      },
    ],
    [
      "nested props context can NOT 'pass' props through UI component, if structure does not match ALL UI components",
      {
        propsContext: {
          C2: {
            C4: {
              prop: "parent",
            },
          },
        },
      },
      {
        type: "ui",
      },
      {
        type: "ui", // C3 is not in context structure
      },
      {
        type: "ui",
      },
      {
        expectedProps: {},
      },
    ],
    [
      "higher nesting level overrides nested props context",
      {
        propsContext: {
          C2: {
            C3: {
              prop: "grandParent",
            },
          },
        },
      },
      {
        propsContext: {
          C3: {
            prop: "parent",
          },
        },
      },
      {
        expectedProps: {
          prop: "grandParent",
        },
      },
    ],
    [
      "same nesting level does NOT override nested props context",
      {
        propsContext: {
          C3: {
            prop: "grandParent",
          },
        },
      },
      {
        propsContext: {
          C3: {
            prop: "parent",
          },
        },
      },
      {
        expectedProps: {
          prop: "parent",
        },
      },
    ],
  ])("%s", (name, ...testCases) => {
    const components = testCases.map((testCase, index) => {
      return flowComponent(
        getComponentName(`C${index + 1}`),
        (props) => {
          const { children, ...rest } = props;
          if (testCase.expectedProps) {
            expect(rest).toEqual(testCase.expectedProps);
          }

          if (testCase.propsContext) {
            return (
              <PropsContextProvider props={testCase.propsContext}>
                {children}
              </PropsContextProvider>
            );
          }

          return <>{children}</>;
        },
        { type: testCase.type },
      );
    });

    let elements: ReactElement = <></>;

    for (let i = components.length - 1; i >= 0; i--) {
      const Component = components[i]!;
      const testCase = testCases[i]!;
      elements = <Component {...testCase.localProps}>{elements}</Component>;
    }

    render(elements);
  });
});
