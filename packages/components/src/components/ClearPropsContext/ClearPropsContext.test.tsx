import useProps from "@/lib/hooks/useProps";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import type { TestComponentProps } from "@/lib/propsContext/test";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import { render, screen } from "@testing-library/react";
import type { FC } from "react";
import { expect, test } from "vitest";

const ComponentUsingProps: FC<TestComponentProps> = (props) => {
  const { testProp } = useProps("TestComponent", props);
  return <span data-testid="prop-value">{testProp ?? "undefined"}</span>;
};

const expectPropertyToBe = (expected: string): void =>
  expect(screen.getByTestId("prop-value").innerHTML).toBe(expected);

test("Component clears the context for children", () => {
  render(
    <PropsContextProvider
      props={{
        TestComponent: {
          testProp: "context",
        },
      }}
    >
      <ClearPropsContextView>
        <ComponentUsingProps />
      </ClearPropsContextView>
    </PropsContextProvider>,
  );

  expectPropertyToBe("undefined");
});
