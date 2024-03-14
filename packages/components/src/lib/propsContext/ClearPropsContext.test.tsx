import { render, screen } from "@testing-library/react";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import React, { FC } from "react";
import useProps from "@/lib/propsContext/useProps";
import ClearPropsContext from "@/lib/propsContext/ClearPropsContext";
import { TestComponentProps } from "@/lib/propsContext/test";
import { expect, test } from "vitest";

const ComponentUsingProps: FC<TestComponentProps> = (props) => {
  const { testProp } = useProps("test", props);
  return <span data-testid="prop-value">{testProp ?? "undefined"}</span>;
};

const expectPropertyToBe = (expected: string): void =>
  expect(screen.getByTestId("prop-value").innerHTML).toBe(expected);

test("Component clears the context for children", () => {
  render(
    <PropsContextProvider
      props={{
        test: {
          testProp: "context",
        },
      }}
    >
      <ClearPropsContext>
        <ComponentUsingProps />
      </ClearPropsContext>
    </PropsContextProvider>,
  );

  expectPropertyToBe("undefined");
});
