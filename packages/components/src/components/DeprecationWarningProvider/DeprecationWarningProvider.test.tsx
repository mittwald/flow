/** @vitest-environment happy-dom */
import {
  DeprecationWarningProvider,
  useWarnDeprecation,
} from "@/components/DeprecationWarningProvider";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";

const message = "This API is deprecated.";

const WarningComponent = () => {
  const warnDeprecation = useWarnDeprecation();

  warnDeprecation(message);
  warnDeprecation(message);

  return null;
};

afterEach(() => {
  vi.restoreAllMocks();
});

test("warns through console and provider callback only once per message", async () => {
  const consoleWarn = vi.spyOn(console, "warn");
  const onWarning = vi.fn();
  const container = document.createElement("div");
  const root = createRoot(container);

  await act(async () => {
    root.render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <WarningComponent />
      </DeprecationWarningProvider>,
    );
  });

  expect(consoleWarn).toHaveBeenCalledTimes(1);
  expect(consoleWarn).toHaveBeenCalledWith(message);
  expect(onWarning).toHaveBeenCalledTimes(1);
  expect(onWarning).toHaveBeenCalledWith(message);

  await act(async () => {
    root.render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <WarningComponent />
      </DeprecationWarningProvider>,
    );
  });

  expect(consoleWarn).toHaveBeenCalledTimes(1);
  expect(onWarning).toHaveBeenCalledTimes(1);

  root.unmount();
});

test("warns only once per message across component instances", async () => {
  const message = "This other API is deprecated.";
  const consoleWarn = vi.spyOn(console, "warn");
  const onWarning = vi.fn();
  const container = document.createElement("div");
  const root = createRoot(container);

  const Warn = () => {
    useWarnDeprecation()(message);
    return null;
  };

  await act(async () => {
    root.render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Warn />
        <Warn />
      </DeprecationWarningProvider>,
    );
  });

  await act(async () => {
    root.render(
      <DeprecationWarningProvider onWarning={onWarning}>
        <Warn />
        <Warn />
        <Warn />
      </DeprecationWarningProvider>,
    );
  });

  expect(consoleWarn).toHaveBeenCalledTimes(1);
  expect(onWarning).toHaveBeenCalledTimes(1);
  expect(onWarning).toHaveBeenCalledWith(message);

  root.unmount();
});

test("reports to every provider once, with an inline handler too", async () => {
  const message = "A third API is deprecated.";
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const firstWarnings: string[] = [];
  const secondWarnings: string[] = [];
  const container = document.createElement("div");
  const root = createRoot(container);

  const Warn = () => {
    useWarnDeprecation()(message);
    return null;
  };

  const renderTree = () =>
    root.render(
      <>
        <DeprecationWarningProvider
          onWarning={(warning) => firstWarnings.push(warning)}
        >
          <Warn />
        </DeprecationWarningProvider>
        <DeprecationWarningProvider
          onWarning={(warning) => secondWarnings.push(warning)}
        >
          <Warn />
        </DeprecationWarningProvider>
      </>,
    );

  await act(async () => renderTree());
  await act(async () => renderTree());

  expect(firstWarnings).toEqual([message]);
  expect(secondWarnings).toEqual([message]);

  root.unmount();
});
