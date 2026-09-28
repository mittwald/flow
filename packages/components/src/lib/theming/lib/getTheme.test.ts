import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

let clientSide = false;

vi.mock("./isClientSide", () => ({
  isClientSide: () => clientSide,
}));

const { getFallbackTheme } = await import("./getFallbackTheme");
const { getTheme } = await import("./getTheme");
const { getThemeHtmlAttribute } = await import("./getThemeHtmlAttribute");
const { sanitizeTheme } = await import("./sanitizeTheme");
const { themeHtmlAttribute } = await import("./keys");

/** Stands in for the `<html>` element the theme is read from. */
const documentWithTheme = (theme: string | null) => ({
  documentElement: {
    getAttribute: (name: string) =>
      name === themeHtmlAttribute ? theme : null,
  },
});

const onClient = (theme: string | null) => {
  clientSide = true;
  vi.stubGlobal("document", documentWithTheme(theme));
};

beforeEach(() => {
  clientSide = false;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sanitizeTheme", () => {
  test.each(["light", "dark", "system"] as const)("keeps %s", (theme) => {
    expect(sanitizeTheme(theme)).toBe(theme);
  });

  test.each([null, undefined, "", "Dark", "solarized"])(
    "falls back for %o",
    (theme) => {
      expect(sanitizeTheme(theme)).toBe(getFallbackTheme());
    },
  );
});

describe("getFallbackTheme", () => {
  /*
   * On the server there is nothing to ask for a preference, and the fallback has
   * to be a resolved theme: "system" would render markup that does not survive
   * hydration.
   */
  test("is light on the server", () => {
    expect(getFallbackTheme()).toBe("light");
  });

  test("is system on the client, where the preference can be read", () => {
    onClient(null);
    expect(getFallbackTheme()).toBe("system");
  });
});

describe("getThemeHtmlAttribute", () => {
  test("there is no document to read on the server", () => {
    expect(getThemeHtmlAttribute()).toBeUndefined();
  });

  test("reads the attribute", () => {
    onClient("dark");
    expect(getThemeHtmlAttribute()).toBe("dark");
  });

  test("an unknown attribute value is sanitized away", () => {
    onClient("solarized");
    expect(getThemeHtmlAttribute()).toBe("system");
  });
});

describe("getTheme", () => {
  test("the attribute wins", () => {
    onClient("dark");
    expect(getTheme()).toBe("dark");
  });

  test("without an attribute the fallback applies", () => {
    onClient(null);
    expect(getTheme()).toBe("system");
  });

  test("on the server it is light", () => {
    expect(getTheme()).toBe("light");
  });
});
