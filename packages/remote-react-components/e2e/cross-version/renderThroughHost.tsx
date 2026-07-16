import type { RemoteExtBridgeConnectionApi } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect } from "vitest";
import { render } from "vitest-browser-react";
import { normalizeHtml } from "./normalizeHtml";

export const renderThroughHostTimeout = 30_000;

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
  scenarioFile: string,
  scenarioName: string,
): string => {
  const url = new URL("http://localhost");
  url.port = String(port);
  url.searchParams.set("file", scenarioFile);
  url.searchParams.set("scenario", scenarioName);
  return url.toString();
};

export const renderThroughHost = async (
  port: number,
  scenarioFile: string,
  scenarioName: string,
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
          src={buildSrc(port, scenarioFile, scenarioName)}
          timeoutMs={renderThroughHostTimeout}
          extBridgeImplementation={extBridgeImplementation}
        />
      </Suspense>
    </ErrorBoundary>,
  );

  // Wait until the remote output is not just painted but stable. Capturing the
  // instant the Suspense loading view disappears races the remote render and
  // transient component states.
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
      { timeout: renderThroughHostTimeout, interval: 150 },
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
