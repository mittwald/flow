import { getRemoteEvent } from "@mittwald/flow-react-components";
import "@mittwald/flow-remote-elements";
import { expect, test } from "vitest";

/*
 * `FlowRemoteElement` runs a listener inside React Flow's `eventHandlerContext`
 * without importing it: both packages spell out the same `Symbol.for` key.
 * Spelled differently, the listener runs outside the context and nothing fails
 * but the remote-value echo detection.
 */
test("a remote element's listener runs in React Flow's event handler context", () => {
  const element = document.createElement("flr-button");
  let remoteEvent: ReturnType<typeof getRemoteEvent>;
  element.addEventListener("press", () => (remoteEvent = getRemoteEvent()));

  element.dispatchEvent(new Event("press"));

  expect(remoteEvent).toEqual({ type: "press" });
});
