import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

export const remoteTestServerPort = 6022;

export const renderRemoteTest = (testName: string) => {
  const testFilePath = expect.getState().snapshotState.testFilePath;

  const url = new URL("http://localhost");
  url.port = String(remoteTestServerPort);
  url.searchParams.set("test", testName ?? "");
  url.searchParams.set("file", testFilePath.replace(".test.", ".test.remote."));

  return render(
    <ErrorBoundary fallbackRender={({ error }) => "Error: " + String(error)}>
      <Suspense
        fallback={<div data-testid="root-loading-view">Loading...</div>}
      >
        <RemoteRenderer src={url.toString()} />
      </Suspense>
    </ErrorBoundary>,
  );
};
