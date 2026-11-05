const excludedPropNames = new Set([
  "dangerouslysetinnerhtml",
  "ref",
  "key",
  "is",
  "formaction",
]);

export const filterRemoteProps = (
  props: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(props).filter(([name, value]) => {
      const lowerCaseName = name.toLowerCase();

      if (excludedPropNames.has(lowerCaseName)) {
        return false;
      }

      if (lowerCaseName === "action" && typeof value !== "function") {
        return false;
      }

      return !lowerCaseName.startsWith("on") || typeof value === "function";
    }),
  );
