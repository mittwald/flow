import { expectTypeOf, test, vitest } from "vitest";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { ComponentType, PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { HTMLDivElement as HappyHTMLDivElement } from "happy-dom";
import type { FlowComponentName } from "@/components/propTypes";
import { propsContextSupportingComponents } from "@/components/propTypes";
import { PropsContextProvider } from "@/lib/propsContext";
import { ClearPropsContext } from "@/components/ClearPropsContext";

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

  test("prop is taken from outer context when ___inherit is true", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent2Name]: {
            prop: "foo",
            ___inherit: true,
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
          <div data-testid="test2">
            <div data-testid="prop">foo</div>
          </div>
        </div>
      </div>,
    ).container.innerHTML;

    expect(actual).toBe(expected);
  });

  test("prop is NOT taken from outer context when ___inherit is NOT true", () => {
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

  test("prop is NOT taken from outer context when ___inherit is true but ClearPropsContext is used", () => {
    const actual = render(
      <PropsContextProvider
        props={{
          [testComponent2Name]: {
            prop: "foo",
            ___inherit: true,
          },
        }}
      >
        <TestComponent1>
          <ClearPropsContext>
            <PropsContextProvider props={{}}>
              <TestComponent2 />
            </PropsContextProvider>
          </ClearPropsContext>
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
});
