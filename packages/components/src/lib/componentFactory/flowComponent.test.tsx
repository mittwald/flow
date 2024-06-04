import { expectTypeOf, test, vitest } from "vitest";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { ComponentType, LegacyRef, PropsWithChildren } from "react";
import React from "react";
import { render } from "@testing-library/react";
import { HTMLDivElement } from "happy-dom";
import type { FlowComponentName } from "@/components/propTypes";
import { propsContextSupportingComponents } from "@/components/propTypes";
import type { PropsWithRender, PropsWithTunnel } from "@/lib/types/props";
import { PropsContextProvider } from "@/lib/propsContext";

const getComponentName = (name: string): FlowComponentName => {
  propsContextSupportingComponents.push(name as FlowComponentName);
  return name as FlowComponentName;
};

type FlowComponentProps<P> = PropsWithTunnel &
  PropsWithRender<P> & { refProp?: LegacyRef<never> } & P;

const testComponent1Name = getComponentName("Test1");
const testComponent2Name = getComponentName("Test2");

type TestComponentProps = FlowComponentProps<
  PropsWithChildren<{
    prop?: string;
    otherProp?: string;
  }>
>;

type TestComponent = ComponentType<TestComponentProps>;

const TestComponent1 = flowComponent(
  testComponent1Name,
  (props: TestComponentProps) => (
    <div data-testid="test1" ref={props.refProp}>
      {props.prop && <div data-testid="prop">{props.prop}</div>}
      {props.otherProp && <div data-testid="otherProp">{props.otherProp}</div>}
      {props.children && <div data-testid="children1">{props.children}</div>}
    </div>
  ),
) as TestComponent;

const TestComponent2 = flowComponent(
  testComponent2Name,
  (props: TestComponentProps) => (
    <div data-testid="test2" ref={props.refProp}>
      {props.prop && <div data-testid="prop">{props.prop}</div>}
      {props.otherProp && <div data-testid="otherProp">{props.otherProp}</div>}
      {props.children && <div data-testid="children2">{props.children}</div>}
    </div>
  ),
) as TestComponent;

test("ref is forwarded to component", () => {
  const ref = vitest.fn();
  render(<TestComponent1 refProp={ref} />);
  const refArg = ref.mock.calls[0][0];
  expectTypeOf(refArg).toMatchTypeOf(HTMLDivElement);
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
            mergeInParentContext
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

  test("prop is taken from outer context when 'mergeInParentContext' is enabled", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent2Name]: {
            prop: "foo",
          },
        }}
      >
        <TestComponent1>
          <PropsContextProvider props={{}} mergeInParentContext>
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

  test("prop is NOT taken from outer context when 'mergeInParentContext' is disabled", () => {
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

  test("child component context can be overridden by inner context", () => {
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
            mergeInParentContext
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
});

describe("render()", () => {
  test("can be used to change output from component", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            render: (Component: TestComponent, props: TestComponentProps) => (
              <Component {...props} prop={props.prop + "bar"} />
            ),
          },
        }}
      >
        <TestComponent1 prop="foo" />
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">foobar</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("can be used nested", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            render: (Component: TestComponent, props: TestComponentProps) => (
              <Component {...props} prop={props.prop + "baz"} />
            ),
          },
        }}
      >
        <PropsContextProvider
          props={{
            [testComponent1Name]: {
              render: (Component: TestComponent, props: TestComponentProps) => (
                <Component {...props} prop={props.prop + "bar"} />
              ),
            },
          }}
        >
          <TestComponent1 prop="foo" />
        </PropsContextProvider>
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">foobarbaz</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("can be used nested inside parent render", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            render: (Component: TestComponent, props: TestComponentProps) => (
              <PropsContextProvider
                props={{
                  [testComponent1Name]: {
                    render: (
                      Component: TestComponent,
                      props: TestComponentProps,
                    ) => <Component {...props} prop={props.prop + "baz"} />,
                  },
                }}
              >
                <Component {...props} prop={props.prop + "bar"} />
              </PropsContextProvider>
            ),
          },
        }}
      >
        <TestComponent1 prop="foo" />
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">foobarbaz</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("uses props from context", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            prop: "foo",
            render: (Component: TestComponent, props: TestComponentProps) => (
              <Component {...props} prop={props.prop + "bar"} />
            ),
          },
        }}
      >
        <TestComponent1 />
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">foobar</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("uses local overridden prop", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent1Name]: {
            prop: "baz",
            render: (Component: TestComponent, props: TestComponentProps) => (
              <Component {...props} prop={props.prop + "bar"} />
            ),
          },
        }}
      >
        <TestComponent1 prop="foo" />
      </PropsContextProvider>,
    ).container.innerHTML;

    const expected = render(
      <div data-testid="test1">
        <div data-testid="prop">foobar</div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });
});
