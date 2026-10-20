import { isRenderError } from "@/lib/isRenderError";
import { describe, expect, test } from "vitest";

const reference = "https://vuejs.org/error-reference/#runtime-";

describe("isRenderError", () => {
  test.each([
    "render function",
    "setup function",
    `${reference}0`,
    `${reference}1`,
  ])("counts %s", (info) => {
    expect(isRenderError(info)).toBe(true);
  });

  /* `m` is the mounted hook, 3 a watcher callback, 10 and 14 share a digit. */
  test.each([
    "mounted hook",
    "watcher callback",
    "component event handler",
    `${reference}m`,
    `${reference}3`,
    `${reference}10`,
    `${reference}14`,
  ])("leaves out %s", (info) => {
    expect(isRenderError(info)).toBe(false);
  });
});
