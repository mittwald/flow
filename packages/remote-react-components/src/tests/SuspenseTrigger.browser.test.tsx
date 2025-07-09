import { expectNeverBeInTheDocument } from "@/tests/helpers";
import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { test } from "vitest";

test("SuspenseTrigger triggers suspense on host", async () => {
  const dom = renderRemoteTest("standard");
  const content = dom.getByTestId("content");
  await expectNeverBeInTheDocument(content);
});
