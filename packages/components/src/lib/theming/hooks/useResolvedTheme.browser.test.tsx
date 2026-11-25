import type { PropsWithChildren } from "react";
import { renderHook } from "vitest-browser-react";
import { afterEach, beforeEach, expect, test } from "vitest";
import { ThemeScopeContext } from "../context";
import { themeHtmlAttribute } from "../lib/keys";
import type { Theme } from "../types";
import { useResolvedTheme } from "./useResolvedTheme";

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const notSystemTheme = () => (systemTheme() === "dark" ? "light" : "dark");

const inScope =
  (theme: Theme) =>
  ({ children }: PropsWithChildren) => (
    <ThemeScopeContext value={theme}>{children}</ThemeScopeContext>
  );

beforeEach(() => {
  document.documentElement.setAttribute(themeHtmlAttribute, notSystemTheme());
});

afterEach(() => {
  document.documentElement.removeAttribute(themeHtmlAttribute);
});

test("outside a scope, the document theme applies", async () => {
  const { result } = await renderHook(() => useResolvedTheme());
  expect(result.current).toBe(notSystemTheme());
});

test("a scope wins over the document theme", async () => {
  const { result } = await renderHook(() => useResolvedTheme(), {
    wrapper: inScope(systemTheme()),
  });
  expect(result.current).toBe(systemTheme());
});

test("a system scope follows the operating system, not the document", async () => {
  const { result } = await renderHook(() => useResolvedTheme(), {
    wrapper: inScope("system"),
  });
  expect(result.current).toBe(systemTheme());
});
