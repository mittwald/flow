import { render, screen } from "@testing-library/react";
import { Render } from "~/lib/react/components/Render/Render";
import React from "react";
import { expect, test } from "vitest";

test("Renders result of render function", () => {
  render(<Render>{() => <span>Foo</span>}</Render>);
  expect(screen.getByText("Foo")).toBeDefined();
});
