import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("bla", async () => {
  const { getByText } = render(
    <ErrorBoundary fallbackRender={({ error }) => "Fehler: " + String(error)}>
      <Suspense fallback="Lade">
        <RemoteRenderer src="http://localhost:6022/?file=/src/components/RemoteRoot.browser.test.remote.tsx&test=bla" />
      </Suspense>
    </ErrorBoundary>,
  );
  await expect.element(getByText("Bla")).toBeInTheDocument();
});
