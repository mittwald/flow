import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

export const remoteTestServerPort = 6022;

export const renderRemoteTest = async (testName: string) => {
  const testFilePath = expect.getState().snapshotState.testFilePath;

  const url = new URL("http://localhost");
  url.port = String(remoteTestServerPort);
  url.searchParams.set("test", testName ?? "");
  url.searchParams.set("file", testFilePath.replace(".test.", ".test.remote."));

  const isReady = Promise.withResolvers<void>();

  const renderResult = render(
    <ErrorBoundary fallbackRender={({ error }) => "Error: " + String(error)}>
      <Suspense
        fallback={<div data-testid="root-loading-view">Loading...</div>}
      >
        <RemoteRenderer src={url.toString()} timeoutMs={100_000} />
        <div
          ref={() => {
            isReady.resolve();
          }}
        />
      </Suspense>
    </ErrorBoundary>,
  );

  await isReady.promise;

  return renderResult;
};
