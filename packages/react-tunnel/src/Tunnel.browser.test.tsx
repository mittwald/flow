import TunnelEntry, { type TunnelEntryProps } from "./components/TunnelEntry";
import TunnelExit from "./components/TunnelExit";
import TunnelProvider from "./components/TunnelProvider";
import { expect, test, describe, vitest } from "vitest";
import { render } from "vitest-browser-react";
import React, {
  StrictMode,
  Suspense,
  useState,
  type ComponentType,
  type FC,
  type PropsWithChildren,
} from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { userEvent } from "vitest/browser";
import { TunnelState } from "./TunnelState";

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

// Regression guard for the first client commit. Anything that inspects the DOM
// in a layout effect — react-aria's `useSlot`, which decides whether a slotted
// `<Label>` exists — only ever sees the first commit. A tunnelled child that
// arrives after it is invisible, and react-aria then warns about a missing
// accessible name (mittwald/flow#3015).
test("Content from entry is in the DOM in the first commit", async () => {
  const seenInLayoutEffect: string[] = [];

  const Probe: FC<PropsWithChildren> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useLayoutEffect(() => {
      seenInLayoutEffect.push(ref.current?.textContent ?? "");
    }, []);
    return <div ref={ref}>{props.children}</div>;
  };

  await render(
    <Probe>
      <TunnelProvider>
        <TunnelEntry>Hello!</TunnelEntry>
        <TunnelExit />
      </TunnelProvider>
    </Probe>,
  );

  expect(seenInLayoutEffect).toEqual(["Hello!"]);
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

  await dom.rerender(
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

  await dom.rerender(
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

  await dom.rerender(
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

  await dom.rerender(
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

  await dom.rerender(
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

test("Order of multiple children is preserved when entry is added dynamically", async () => {
  const ComponentWithEntry: FC<TunnelEntryProps> = (props) => (
    <TunnelEntry {...props} />
  );

  const Test: FC = () => {
    const [showFirstEntry, setShowFirstEntry] = useState(false);

    return (
      <>
        <button
          onClick={() => setShowFirstEntry((s) => !s)}
          data-testid="toggle"
        >
          Toggle
        </button>
        <TunnelProvider>
          <div data-testid="exit">
            <TunnelExit />
          </div>
          <ComponentWithEntry>0</ComponentWithEntry>
          {showFirstEntry && <ComponentWithEntry>1</ComponentWithEntry>}
          <ComponentWithEntry>2</ComponentWithEntry>
        </TunnelProvider>
      </>
    );
  };

  const dom = await render(<Test />);
  expect(dom.getByTestId("exit")).toHaveTextContent("02");

  await userEvent.click(dom.getByTestId("toggle"));
  expect(dom.getByTestId("exit")).toHaveTextContent("012");

  await userEvent.click(dom.getByTestId("toggle"));
  expect(dom.getByTestId("exit")).toHaveTextContent("02");
});

test("Order of multiple children is preserved when entry is rerendered", async () => {
  const ComponentWithEntry: FC<TunnelEntryProps & { name: string }> = (
    props,
  ) => {
    const { name, ...restProps } = props;
    const [, setSomeState] = useState(0);

    return (
      <div data-testid={`entry-${props.name}`}>
        <button
          onClick={() => setSomeState((s) => s + 1)}
          data-testid={`button-${props.name}`}
        >
          Rerender
        </button>
        <TunnelEntry {...restProps}>{name}</TunnelEntry>
      </div>
    );
  };

  const Test: FC = () => (
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      <ComponentWithEntry name="A" />
      <ComponentWithEntry name="B" />
      <ComponentWithEntry name="C" />
    </TunnelProvider>
  );

  const dom = await render(<Test />);
  expect(dom.getByTestId("exit")).toHaveTextContent("ABC");

  await userEvent.click(dom.getByTestId("button-A"));
  expect(dom.getByTestId("exit")).toHaveTextContent("ABC");

  await userEvent.click(dom.getByTestId("button-B"));
  expect(dom.getByTestId("exit")).toHaveTextContent("ABC");

  await userEvent.click(dom.getByTestId("button-C"));
  expect(dom.getByTestId("exit")).toHaveTextContent("ABC");
});

test("Order of multiple children is changed when entries are changing", async () => {
  const ComponentWithEntry: FC<TunnelEntryProps & { name: string }> = (
    props,
  ) => {
    const { name, ...restProps } = props;

    return (
      <div data-testid={`entry-${props.name}`}>
        <TunnelEntry {...restProps}>{name}</TunnelEntry>
      </div>
    );
  };

  const Test: FC<PropsWithChildren> = (props) => (
    <TunnelProvider>
      <div data-testid="exit">
        <TunnelExit />
      </div>
      {props.children}
    </TunnelProvider>
  );

  const dom = await render(
    <Test>
      <ComponentWithEntry name="A" />
      <ComponentWithEntry name="B" />
      <ComponentWithEntry name="C" />
    </Test>,
  );
  expect(dom.getByTestId("exit")).toHaveTextContent("ABC");

  await dom.rerender(
    <Test>
      <ComponentWithEntry name="A" />
      <ComponentWithEntry name="C" />
      <ComponentWithEntry name="B" />
    </Test>,
  );
  expect(dom.getByTestId("exit")).toHaveTextContent("ACB");
});

vitest.useFakeTimers();

test("Content is not rendered if removing previously suspended tunnel entry", async () => {
  const lazyComponentFactory = (props: { sleep: number }) =>
    function Lazy() {
      return new Promise<{ default: ComponentType }>((resolve) => {
        setTimeout(() => {
          resolve({
            default: function Component() {
              return null;
            },
          });
        }, props.sleep);
      });
    };

  const Lazy100 = React.lazy(lazyComponentFactory({ sleep: 100 }));
  const Lazy500 = React.lazy(lazyComponentFactory({ sleep: 500 }));

  const TestComponent: FC<{ renderEntries: boolean }> = (props) => (
    <TunnelProvider id="test">
      <Suspense>
        <Lazy100 />
        <Lazy500 />
        {props.renderEntries && (
          <>
            <TunnelEntry>A</TunnelEntry>
            <TunnelEntry>B</TunnelEntry>
          </>
        )}
      </Suspense>
      <div data-testid="exit">
        <Suspense>
          <TunnelExit />
        </Suspense>
      </div>
    </TunnelProvider>
  );

  const dom = await render(<TestComponent renderEntries />);
  expect(dom.getByTestId("exit")).toHaveTextContent("");

  vitest.advanceTimersByTime(1000);
  await dom.rerender(<TestComponent renderEntries />);
  expect(dom.getByTestId("exit")).toHaveTextContent("AB");

  await dom.rerender(<TestComponent renderEntries={false} />);
  expect(dom.getByTestId("exit")).toHaveTextContent("");
});

describe("Nested tunnel provider", () => {
  test("Content from entry is rendered in direct parent if no provider ID is used", async () => {
    const dom = await render(
      <TunnelProvider>
        <TunnelProvider>
          <div data-testid="exit">
            <TunnelExit id="hello" />
          </div>
          <TunnelEntry id="hello">Hello!</TunnelEntry>
        </TunnelProvider>
      </TunnelProvider>,
    );
    expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");
  });

  test("Content from entry is rendered in nearest provider with default ID", async () => {
    const dom = await render(
      <TunnelProvider>
        <div data-testid="exit">
          <TunnelExit id="hello" />
        </div>
        <TunnelProvider id="inner">
          <TunnelEntry id="hello">Hello!</TunnelEntry>
        </TunnelProvider>
      </TunnelProvider>,
    );
    expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");
  });

  test("Content from entry is rendered in exit of parent provider", async () => {
    const dom = await render(
      <TunnelProvider id="outer">
        <div data-testid="exit">
          <TunnelExit id="hello" providerId="outer" />
        </div>
        <TunnelProvider id="inner">
          <TunnelEntry id="hello" providerId="outer">
            Hello!
          </TunnelEntry>
        </TunnelProvider>
      </TunnelProvider>,
    );
    expect(dom.getByTestId("exit")).toHaveTextContent("Hello!");
  });

  test("Content from entry is rendered in exit of parent provider", async () => {
    const dom = await render(
      <TunnelProvider id="outer">
        <div data-testid="exit">
          <TunnelExit id="hello" providerId="outer" />
        </div>
        <TunnelProvider id="inner">
          <TunnelEntry id="hello" providerId="outer">
            Hello!
          </TunnelEntry>
        </TunnelProvider>
      </TunnelProvider>,
    );

    await dom.rerender(
      <TunnelProvider id="outer">
        <div data-testid="exit">
          <TunnelExit id="hello" providerId="outer" />
        </div>
      </TunnelProvider>,
    );

    expect(dom.getByTestId("exit")).toBeEmptyDOMElement();
  });
});

// Regression guards for the SSR hydration mismatch. `TunnelExit` reads
// `getEntries` during render, and React 19 may invoke a render more than once
// before committing (StrictMode double-invoke, concurrent re-render). If that
// read is not idempotent, the server-rendered HTML and the client's re-render
// diverge on the tunnelled content — a hydration mismatch.
describe("SSR hydration", () => {
  test("getEntries is a pure read, idempotent across repeated render invocations", () => {
    const state = new TunnelState();
    state.setRenderPhaseChildren("default", "entry-1", 0, "Hello!");

    // Read render-phase children (as the exit does during SSR / first render).
    const first = state.getEntries("default", true);
    const second = state.getEntries("default", true);

    expect(first?.entries.map((entry) => entry.children)).toEqual(["Hello!"]);
    // A second read in the same render pass must see the same render-phase
    // children — not a consumed/emptied result.
    expect(second).toEqual(first);
  });

  test("SSR-rendered tunnel content hydrates without a mismatch", async () => {
    const App: FC = () => (
      <StrictMode>
        <TunnelProvider>
          <TunnelEntry>Hello!</TunnelEntry>
          <div data-testid="exit">
            <TunnelExit />
          </div>
        </TunnelProvider>
      </StrictMode>
    );

    // Server render: render-phase children put "Hello!" into the exit's HTML.
    const serverHtml = renderToString(<App />);
    expect(serverHtml).toContain("Hello!");

    // Hydrate that exact markup on the client.
    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const recoverableErrors: string[] = [];
    const root = hydrateRoot(container, <App />, {
      onRecoverableError: (error) =>
        recoverableErrors.push(
          error instanceof Error ? error.message : String(error),
        ),
    });

    // Let hydration (and any recoverable-error reporting) settle.
    await vitest.waitFor(() =>
      expect(container.querySelector('[data-testid="exit"]')).toHaveTextContent(
        "Hello!",
      ),
    );

    expect(
      recoverableErrors.filter((message) => /hydrat/i.test(message)),
    ).toEqual([]);

    root.unmount();
    container.remove();
  });
});
