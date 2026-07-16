// Host side of the cross-version HTML-output comparison. For each remote entry
// in `tests/entries.browser.test.remote.tsx`, this renders the entry through
// the CURRENT `RemoteRenderer` (pointed at the R1 cross-version server, which
// serves the entry built against the version selected by `FLOW_CROSS_VERSION`),
// waits for the connection, normalizes the host-rendered HTML, and compares it
// to a single version-INDEPENDENT reference in `__html__/`.
//
// The reference files are the CURRENT version's output (generated with
// `FLOW_CROSS_VERSION=current`). Running against an old version then proves the
// old version serializes the same props/structure over the real iframe
// connection — a mismatch is a genuine backwards-compat finding.
import type { RemoteExtBridgeConnectionApi } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { crossVersionServerPort } from "./crossVersionServerPort";
import { normalizeHtml } from "./normalizeHtml";

const loadingTimeout = 30_000;

/** Remote file (relative) the entries live in; matched by the server's glob. */
const remoteFile = "tests/entries.browser.test.remote.tsx";

/** Entry export name → the `data-testid` its rendered element carries. */
const entries: { name: string; testId: string }[] = [
  { name: "buttonDefault", testId: "button" },
  { name: "buttonDisabled", testId: "button" },
  { name: "buttonSoftDanger", testId: "button" },
  { name: "checkboxDefault", testId: "checkbox" },
  { name: "checkboxSelected", testId: "checkbox" },
  { name: "switchSelected", testId: "switch" },
  { name: "badgeColor", testId: "badge" },
  { name: "counterBadge", testId: "counter" },
  { name: "text", testId: "text" },
  { name: "heading", testId: "heading" },
  { name: "link", testId: "link" },
  { name: "textField", testId: "field" },
];

const extBridgeImplementation: RemoteExtBridgeConnectionApi = {
  getConfig: async () => ({
    sessionId: "",
    userId: "",
    extensionId: "",
    extensionInstanceId: "",
  }),
  getSessionToken: async () => "",
};

const buildSrc = (entry: string): string => {
  const url = new URL("http://localhost");
  url.port = String(crossVersionServerPort);
  url.searchParams.set("file", remoteFile);
  url.searchParams.set("test", entry);
  return url.toString();
};

test.each(entries)(
  "cross-version HTML output matches reference: $name",
  async ({ name, testId }) => {
    const renderResult = await render(
      <ErrorBoundary fallbackRender={({ error }) => "Error: " + String(error)}>
        <Suspense
          fallback={<div data-testid="root-loading-view">Loading...</div>}
        >
          <RemoteRenderer
            src={buildSrc(name)}
            timeoutMs={loadingTimeout}
            extBridgeImplementation={extBridgeImplementation}
          />
        </Suspense>
      </ErrorBoundary>,
    );

    // Wait for the remote connection to finish (loading fallback gone).
    await expect
      .poll(
        () =>
          expect(
            renderResult.getByTestId("root-loading-view"),
          ).not.toBeInTheDocument(),
        { timeout: loadingTimeout, interval: 100 },
      )
      .toBeTruthy();

    // Proves the props serialized over the real connection: the rendered
    // element (carrying its data-testid) is present in the host DOM.
    await expect.element(renderResult.getByTestId(testId)).toBeInTheDocument();

    const normalized = normalizeHtml(renderResult.container.innerHTML);

    // Sanity: the normalizer must not have stripped the actual content.
    expect(normalized).toContain(`data-testid="${testId}"`);

    // Plain relative path: vitest resolves it against the test file on disk in
    // both node and browser mode. (A `new URL(..., import.meta.url).pathname`
    // resolves to a server-absolute HTTP path under the browser provider and
    // writes to the wrong place.) The path is version-independent, so every
    // version and the current reference share ONE file per entry.
    await expect(normalized).toMatchFileSnapshot(`./__html__/${name}.html`);
  },
  // The first entry pays the remote server's cold dependency-optimization +
  // connection cost, which can exceed the 15s default.
  loadingTimeout,
);
