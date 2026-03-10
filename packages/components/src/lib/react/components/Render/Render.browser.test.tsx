import { Render } from "@/lib/react/components/Render/Render";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

test("Renders result of render function", async () => {
  await render(<Render>{() => <span>Foo</span>}</Render>);
  expect(page.getByText("Foo")).toBeInTheDocument();
});

test("Supports passing render props", async () => {
  await render(
    <Render renderProps={{ test: "foo" }}>
      {(props) => <span>{props.test}</span>}
    </Render>,
  );
  expect(page.getByText("foo")).toBeInTheDocument();
});
