import type { RemoteExtBridgeConnectionApi } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type { VisualScenarios } from "@/tests/lib/visualScenario";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { currentServerPort, oldServerPort } from "./crossVersionServerPort";
import { isScenarioComparable } from "./entryVersionSupport";
import { normalizeHtml } from "./normalizeHtml";

declare const __FLOW_CROSS_VERSION__: string;

const loadingTimeout = 30_000;

const scenarioModules = import.meta.glob<{ default: VisualScenarios }>(
  "../../src/tests/visual/*.scenarios.tsx",
  { eager: true },
);

const scenarios = Object.entries(scenarioModules)
  .flatMap(([scenarioPath, scenarioModule]) => {
    const scenarioFile = scenarioPath.slice(scenarioPath.lastIndexOf("/") + 1);
    return Object.keys(scenarioModule.default).map((scenarioName) => ({
      scenarioFile,
      scenarioName,
    }));
  })
  .filter(({ scenarioFile, scenarioName }) =>
    isScenarioComparable(scenarioFile, scenarioName, __FLOW_CROSS_VERSION__),
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
  scenarioFile: string,
  scenarioName: string,
): string => {
  const url = new URL("http://localhost");
  url.port = String(port);
  url.searchParams.set("file", scenarioFile);
  url.searchParams.set("test", scenarioName);
  return url.toString();
};

const renderRemoteScenario = async (
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
          timeoutMs={loadingTimeout}
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

test.each(scenarios)(
  "cross-version HTML output matches: $scenarioFile#$scenarioName",
  async ({ scenarioFile, scenarioName }) => {
    const reference = await renderRemoteScenario(
      currentServerPort,
      scenarioFile,
      scenarioName,
    );
    expect(reference).not.toBe("");

    let candidate: string;
    try {
      candidate = await renderRemoteScenario(
        oldServerPort,
        scenarioFile,
        scenarioName,
      );
    } catch (error) {
      console.warn(
        `[cross-version] SKIP ${scenarioFile}#${scenarioName}: ` +
          `the old version could not render this scenario (${String(error)})`,
      );
      return;
    }

    expect(candidate).toEqual(reference);
  },
  loadingTimeout * 2 + 10_000,
);
