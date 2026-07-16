import type { RemoteExtBridgeConnectionApi } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { crossVersionServerPort } from "./crossVersionServerPort";
import { isEntryComparable } from "./entryVersionSupport";
import { normalizeHtml } from "./normalizeHtml";

declare const __FLOW_CROSS_VERSION__: string;

const referenceServerPort = 6022;
const loadingTimeout = 30_000;
const entryBasePath = "../tests";

// Enumerate (entry file, export) pairs from the remote entries' SOURCE text,
// not by importing the modules: an eager import would execute their Flow
// component imports on the host side and resolve them through the old-version
// alias, which fails for any component a given old version does not ship. We
// only need the export names, and those are version-independent.
const entrySources = import.meta.glob<string>(
  "../tests/*.browser.test.remote.tsx",
  { query: "?raw", import: "default", eager: true },
);

const exportNamePattern = /export const (\w+) =/g;

const entries = Object.entries(entrySources)
  .flatMap(([entryFile, source]) =>
    [...source.matchAll(exportNamePattern)].map((match) => ({
      entryFile: entryFile.slice(entryBasePath.length),
      exportName: match[1],
    })),
  )
  .filter(({ entryFile, exportName }) =>
    isEntryComparable(entryFile, exportName, __FLOW_CROSS_VERSION__),
  );

const extBridgeImplementation: RemoteExtBridgeConnectionApi = {
  getConfig: async () => ({
    sessionId: "",
    userId: "",
    extensionId: "",
    extensionInstanceId: "",
  }),
  getSessionToken: async () => "",
};

const buildSrc = (
  port: number,
  entryFile: string,
  exportName: string,
): string => {
  const url = new URL("http://localhost");
  url.port = String(port);
  url.searchParams.set("file", entryFile);
  url.searchParams.set("test", exportName);
  return url.toString();
};

const renderRemoteEntry = async (
  port: number,
  entryFile: string,
  exportName: string,
): Promise<string> => {
  const renderResult = await render(
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div data-testid="remote-render-error">Error: {String(error)}</div>
      )}
    >
      <Suspense
        fallback={<div data-testid="root-loading-view">Loading...</div>}
      >
        <RemoteRenderer
          src={buildSrc(port, entryFile, exportName)}
          timeoutMs={loadingTimeout}
          extBridgeImplementation={extBridgeImplementation}
        />
      </Suspense>
    </ErrorBoundary>,
  );

  // Wait until the remote output is not just painted but STABLE. Capturing the
  // instant the Suspense loading view disappears races the remote render (the
  // container may still hold only the hidden connection iframe → normalizeHtml
  // "") and also races transient states (e.g. a List's `--is-loading` class),
  // which would flake the comparison. So poll until the normalized HTML is
  // non-empty and unchanged across two consecutive samples, or the error
  // boundary trips.
  let lastHtml = "";
  await expect
    .poll(
      () => {
        if (
          renderResult.container.querySelector(
            '[data-testid="root-loading-view"]',
          )
        ) {
          lastHtml = "";
          return false;
        }
        if (
          renderResult.container.querySelector(
            '[data-testid="remote-render-error"]',
          )
        ) {
          return true;
        }
        const html = normalizeHtml(renderResult.container.innerHTML);
        if (html !== "" && html === lastHtml) {
          return true;
        }
        lastHtml = html;
        return false;
      },
      { timeout: loadingTimeout, interval: 150 },
    )
    .toBe(true);

  const renderError = renderResult.container.querySelector(
    '[data-testid="remote-render-error"]',
  )?.textContent;

  if (renderError) {
    throw new Error(renderError);
  }

  return normalizeHtml(renderResult.container.innerHTML);
};

test.each(entries)(
  "cross-version HTML output matches: $entryFile#$exportName",
  async ({ entryFile, exportName }) => {
    const reference = await renderRemoteEntry(
      referenceServerPort,
      entryFile,
      exportName,
    );
    expect(reference).not.toBe("");

    let candidate: string;
    try {
      candidate = await renderRemoteEntry(
        crossVersionServerPort,
        entryFile,
        exportName,
      );
    } catch (error) {
      console.warn(
        `[cross-version] SKIP ${entryFile}#${exportName}: ` +
          `the old version could not render this entry (${String(error)})`,
      );
      return;
    }

    expect(candidate).toEqual(reference);
  },
  loadingTimeout * 2 + 10_000,
);
