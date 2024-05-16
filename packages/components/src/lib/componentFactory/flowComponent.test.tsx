import { expectTypeOf, test, vitest } from "vitest";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React from "react";
import { render } from "@testing-library/react";
import { HTMLDivElement } from "happy-dom";

const TestComponent = flowComponent("TestComponent", (props) => {
  const { children, refProp: ref } = props;
  return <div ref={ref}>{children}</div>;
});

test("ref is forwarded to component", () => {
  const ref = vitest.fn();
  render(<TestComponent ref={ref} />);
  const refArg = ref.mock.calls[0][0];
  expectTypeOf(refArg).toMatchTypeOf(HTMLDivElement);
});
