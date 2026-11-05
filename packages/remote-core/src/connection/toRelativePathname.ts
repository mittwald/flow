const RELATIVE_PATH_ORIGIN = "https://example.invalid";
const hasControlCharacter = (value: string) =>
  [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || (code >= 0x7f && code <= 0x9f);
  });

/** Returns a normalized relative in-app path. */
export const toRelativePathname = (value: unknown): string | undefined => {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\") ||
    value.includes("\\") ||
    hasControlCharacter(value)
  ) {
    return undefined;
  }

  try {
    const url = new URL(value, RELATIVE_PATH_ORIGIN);

    if (url.origin !== RELATIVE_PATH_ORIGIN) {
      return undefined;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
};
