import React from "react";
import TunnelEntry from "./components/TunnelEntry";
import TunnelExit from "./components/TunnelExit";
import TunnelProvider from "./components/TunnelProvider";
import { expect, test } from "vitest";
import { render, waitFor } from "@testing-library/react";

test("Exit is empty when no entry is set", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("");
  });
});

test("Exit is empty when using other tunnel ids", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit id="foo" />
      </div>
      <TunnelEntry id="bar">Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("");
  });
});

test("Content from entry is rendered in exit", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <div data-testid="entry">
        <TunnelEntry>Hello!</TunnelEntry>
      </div>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Hello!");
    expect(dom.getByTestId("entry").innerText).toBe("");
  });
});

test("Content from entry is rendered in exit when using same tunnel ids", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit id="foo" />
      </div>
      <div data-testid="entry">
        <TunnelEntry id="foo">Hello!</TunnelEntry>
      </div>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Hello!");
    expect(dom.getByTestId("entry").innerText).toBe("");
  });
});

test("Exit children are rendered as fallback when entry is empty", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>Exit fallback</TunnelExit>
      </div>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Exit fallback");
  });
});

test("Exit children are NOT rendered as fallback when entry is set", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit>Exit fallback</TunnelExit>
      </div>
      <TunnelEntry>Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Hello!");
  });
});

test("Content from entry is updated in exit", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <div data-testid="entry">
        <TunnelEntry>Hello!</TunnelEntry>
      </div>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Hello!");
  });

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <TunnelEntry>Hi!</TunnelEntry>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Hi!");
  });
});

test("Content in exit is removed when not rendering entry", async () => {
  const dom = render(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <TunnelEntry>Hello!</TunnelEntry>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("Hello!");
  });

  dom.rerender(
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
    </TunnelProvider>,
  );

  await waitFor(() => {
    expect(dom.getByTestId("exit").innerText).toBe("");
  });
});
