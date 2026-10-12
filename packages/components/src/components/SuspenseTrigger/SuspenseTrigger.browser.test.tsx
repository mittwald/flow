import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { Suspense } from "react";
import { SuspenseTrigger } from "@/components/SuspenseTrigger";
import { Text } from "@/components/Text";

/*
 * The trigger never resolves on purpose: it holds the closest Suspense boundary
 * in its fallback so a loading state can be shown without waiting for real
 * data.
 */
test("the trigger keeps the surrounding boundary in its fallback", async () => {
  await render(
    <Suspense fallback={<Text>Loading…</Text>}>
      <SuspenseTrigger />
      <Text>Loaded</Text>
    </Suspense>,
  );

  await expect.element(page.getByText("Loading…")).toBeVisible();
  await expect.element(page.getByText("Loaded")).not.toBeInTheDocument();
});

test("show false lets the content through", async () => {
  await render(
    <Suspense fallback={<Text>Loading…</Text>}>
      <SuspenseTrigger show={false} />
      <Text>Loaded</Text>
    </Suspense>,
  );

  await expect.element(page.getByText("Loaded")).toBeVisible();
  await expect.element(page.getByText("Loading…")).not.toBeInTheDocument();
});
