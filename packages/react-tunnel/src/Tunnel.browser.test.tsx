import TunnelEntry from "./components/TunnelEntry";
import TunnelExit from "./components/TunnelExit";
import TunnelProvider from "./components/TunnelProvider";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import type { FC, PropsWithChildren } from "react";

test("Exit is empty when no entry is set", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("");
});

test("Exit is empty when using other tunnel ids", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit id="foo" />
      </div>
      <TunnelEntry id="bar">Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("");
});

test("Content from entry is rendered in exit", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <div data-testid="entry">
        <TunnelEntry>Hello!</TunnelEntry>
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");
  expect(dom.getByTestId("entry")).toHaveTextContent("");
});

test("Content from entry is rendered in exit when using same tunnel ids", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit id="foo" />
      </div>
      <div data-testid="entry">
        <TunnelEntry id="foo">Hello!</TunnelEntry>
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");
  expect(dom.getByTestId("entry")).toHaveTextContent("");
});

test("Exit children are rendered as fallback when entry is empty", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>Exit fallback</TunnelExit>
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Exit fallback");
});

test("Exit children are NOT rendered as fallback when entry is set", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>Exit fallback</TunnelExit>
      </div>
      <TunnelEntry>Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");
});

test("Content from entry is updated in exit", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <div data-testid="entry">
        <TunnelEntry>Hello!</TunnelEntry>
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <TunnelEntry>Hi!</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hi!");
});

test("Content in exit is removed when not rendering entry", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <TunnelEntry>Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("");
});

test("Fallback content in exit is rendered again when not rendering entry", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>Fallback!</TunnelExit>
      </div>
      <TunnelEntry>Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>Fallback!</TunnelExit>
      </div>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Fallback!");
});

test("Render function in TunnelExit gets children from TunnelEntry", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>{(children) => <>{children} Tunnel!</>}</TunnelExit>
      </div>
      <TunnelEntry>Hello</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello Tunnel!");
});

test("Render function in TunnelExit gets updated children from TunnelEntry", async () => {
  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>{(children) => <>{children} Tunnel!</>}</TunnelExit>
      </div>
      <TunnelEntry>Hello</TunnelEntry>
    </TunnelProvider>,
  );

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>{(children) => <>{children} Tunnel!</>}</TunnelExit>
      </div>
      <TunnelEntry>Hi</TunnelEntry>
    </TunnelProvider>,
  );
  expect(dom.getByTestId("exit")).toHaveTextContent("Hi Tunnel!");
});

test("Order of multiple children is preserved when entry is updated", async () => {
  const ComponentWithEntry: FC<PropsWithChildren> = (props) => (
    <TunnelEntry>{props.children}</TunnelEntry>
  );

  const dom = await render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <ComponentWithEntry>Hello </ComponentWithEntry>
      <TunnelEntry>Tunnel!</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Hello Tunnel!");

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <ComponentWithEntry>Bye </ComponentWithEntry>
      <TunnelEntry>Tunnel!</TunnelEntry>
    </TunnelProvider>,
  );

  expect(dom.getByTestId("exit")).toHaveTextContent("Bye Tunnel!");
});
