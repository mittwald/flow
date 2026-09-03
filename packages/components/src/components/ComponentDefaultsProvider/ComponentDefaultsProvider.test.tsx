/** @vitest-environment happy-dom */
import {
  ComponentDefaultsProvider,
  useComponentDefaults,
} from "@/components/ComponentDefaultsProvider";
import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";
import { flags, resetFlags } from "@/flags";
import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";

const ListDefaults = () => {
  const { disableInitialSuspenseBoundary } = useComponentDefaults("List");
  return <>{String(disableInitialSuspenseBoundary)}</>;
};

const FormDefaults = () => {
  const { confirmModalCloseOnUnsavedChanges } = useComponentDefaults("Form");
  return <>{String(confirmModalCloseOnUnsavedChanges)}</>;
};

const renderToText = async (ui: ReactNode): Promise<string> => {
  const container = document.createElement("div");
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  const text = container.textContent ?? "";
  root.unmount();

  return text;
};

afterEach(() => {
  resetFlags();
  vi.restoreAllMocks();
});

test("uses the built-in defaults without a provider", async () => {
  await expect(renderToText(<ListDefaults />)).resolves.toBe("false");
  await expect(renderToText(<FormDefaults />)).resolves.toBe("true");
});

test("a provider overrides the built-in default", async () => {
  const text = await renderToText(
    <ComponentDefaultsProvider
      defaults={{ List: { disableInitialSuspenseBoundary: true } }}
    >
      <ListDefaults />
    </ComponentDefaultsProvider>,
  );

  expect(text).toBe("true");
});

test("a nested provider wins, but keeps the defaults it does not mention", async () => {
  const text = await renderToText(
    <ComponentDefaultsProvider
      defaults={{
        List: { disableInitialSuspenseBoundary: true },
        Form: { confirmModalCloseOnUnsavedChanges: false },
      }}
    >
      <ComponentDefaultsProvider
        defaults={{ List: { disableInitialSuspenseBoundary: false } }}
      >
        <ListDefaults />
        <FormDefaults />
      </ComponentDefaultsProvider>
    </ComponentDefaultsProvider>,
  );

  expect(text).toBe("falsefalse");
});

test("an assigned deprecated flag acts as the default and warns", async () => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const onWarning = vi.fn();

  flags.requireCloseModalConfirmationOnUnsavedChanges = false;

  const text = await renderToText(
    <DeprecationWarningProvider onWarning={onWarning}>
      <FormDefaults />
    </DeprecationWarningProvider>,
  );

  expect(text).toBe("false");
  expect(onWarning).toHaveBeenCalledTimes(1);
  expect(onWarning.mock.calls[0]?.[0]).toContain(
    "'requireCloseModalConfirmationOnUnsavedChanges' flag is deprecated",
  );
});

test("a provider wins over an assigned deprecated flag", async () => {
  vi.spyOn(console, "warn").mockImplementation(() => undefined);

  flags.disableInitialListSuspenseBoundaries = true;

  const text = await renderToText(
    <ComponentDefaultsProvider
      defaults={{ List: { disableInitialSuspenseBoundary: false } }}
    >
      <ListDefaults />
    </ComponentDefaultsProvider>,
  );

  expect(text).toBe("false");
});
