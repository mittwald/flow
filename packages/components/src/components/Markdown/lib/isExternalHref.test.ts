import { describe, expect, test } from "vitest";
import { isExternalHref } from "@/components/Markdown/lib/isExternalHref";

describe("isExternalHref()", () => {
  test.each([
    "https://example.com/archive",
    "http://example.com",
    "HTTPS://example.com",
    "//example.com/archive",
  ])("%s is external", (href) => {
    expect(isExternalHref(href)).toBe(true);
  });

  test.each([
    "/docs/v2/reference",
    "./archive",
    "../archive",
    "archive",
    "#objective",
    "?page=2",
    "https:archive",
    "mailto:rebels@example.com",
    "tel:+49123456",
    "",
    undefined,
  ])("%s is not external", (href) => {
    expect(isExternalHref(href)).toBe(false);
  });
});
