import { expect, test } from "vitest";
import type { ComponentIndexEntry } from "@/lib/componentIndex";
import { remoteNoticeMarkdown, remoteUsageFromEntry } from "./remoteUsage";

const entry = (
  importFrom: string[],
  remote: ComponentIndexEntry["remote"],
): ComponentIndexEntry => ({ importFrom, remote, props: {} });

test("a root-barrel component is imported from the remote root", () => {
  expect(
    remoteUsageFromEntry(
      entry(["@mittwald/flow-react-components"], {
        available: true,
        excludedProps: ["style"],
      }),
    ),
  ).toEqual({
    available: true,
    importFrom: "@mittwald/flow-remote-react-components",
    excludedProps: ["style"],
  });
});

test("a react-hook-form component keeps its entry point remotely", () => {
  expect(
    remoteUsageFromEntry(
      entry(["@mittwald/flow-react-components/react-hook-form"], {
        available: true,
      }),
    ),
  ).toEqual({
    available: true,
    importFrom: "@mittwald/flow-remote-react-components/react-hook-form",
  });
});

test("an flr-universal-only component comes from the remote root", () => {
  expect(
    remoteUsageFromEntry(
      entry(["@mittwald/flow-react-components/flr-universal"], {
        available: true,
      }),
    ).importFrom,
  ).toBe("@mittwald/flow-remote-react-components");
});

test("an unavailable component has no import", () => {
  expect(
    remoteUsageFromEntry(
      entry(["@mittwald/flow-react-components"], { available: false }),
    ),
  ).toEqual({ available: false });
});

test("the notice names the import and the props that do not cross", () => {
  const notice = remoteNoticeMarkdown("Button", {
    available: true,
    importFrom: "@mittwald/flow-remote-react-components",
    excludedProps: ["style", "wrapWith"],
  });

  expect(notice).toContain(
    "Importiere `Button` aus `@mittwald/flow-remote-react-components`",
  );
  expect(notice).toContain("`style`, `wrapWith`");
});

test("the notice for an unavailable component says so", () => {
  expect(remoteNoticeMarkdown("Overlay", { available: false })).toContain(
    "`Overlay` ist in `@mittwald/flow-remote-react-components` nicht verfügbar",
  );
});
