import { expectNotToBeInTheDocumentFor, sleep } from "@/tests/helpers";
import { renderRemoteTest } from "@/tests/renderRemoteTest";
import { expect, test } from "vitest";
import type { RenderResult } from "vitest-browser-react";

const runOpenCloseTest = async (dom: RenderResult) => {
  const openButton = dom.getByTestId("trigger");
  const modalHeading = dom.getByTestId("modal-heading");
  const modalContent = dom.getByTestId("modal-content");
  const closeButton = dom.getByTestId("close-button");

  const checkModalNotVisible = () =>
    Promise.all([
      expectNotToBeInTheDocumentFor(modalHeading, 500),
      expectNotToBeInTheDocumentFor(modalContent, 500),
      expectNotToBeInTheDocumentFor(closeButton, 500),
    ]);

  const checkModalVisible = () =>
    Promise.all([
      expect.element(modalHeading).toBeVisible(),
      expect.element(modalContent).toBeVisible(),
      expect.element(closeButton).toBeVisible(),
    ]);

  await checkModalNotVisible();
  await openButton.click();
  await checkModalVisible();
  await closeButton.click();
  await sleep(100);
  await checkModalNotVisible();
};

test("Test open and close", async () => {
  const dom = renderRemoteTest("standard");
  await runOpenCloseTest(dom);
});

test("Test open and close in List", async () => {
  const dom = renderRemoteTest("inList");
  await runOpenCloseTest(dom);
});
