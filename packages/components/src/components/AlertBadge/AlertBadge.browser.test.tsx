import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { AlertBadge } from "@/components/AlertBadge";

test("An alert badge stays inside the paragraph it is placed in", () => {
  // The HTML parser closes a <p> at the first block element it meets.
  const body = new DOMParser().parseFromString(
    `<p>${renderToString(<AlertBadge status="danger">Failed</AlertBadge>)}</p>`,
    "text/html",
  ).body;

  expect(body.children).toHaveLength(1);
});
