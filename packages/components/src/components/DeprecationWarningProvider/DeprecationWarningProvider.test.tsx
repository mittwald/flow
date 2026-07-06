/**
 * @vitest-environment happy-dom
 */
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
  const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
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
