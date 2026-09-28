import extractDefaultExport from "@/lib/liveCode/components/LiveCodeEditor/lib/extractDefaultExport";

/**
 * The `transformCode` of every `LiveProvider`. It lives at module level for a
 * stable identity: `LiveProvider` re-transpiles whenever it changes, and a
 * fresh transpile is a new component function, so React remounts the preview.
 */
export const transformCode = (code: string) => {
  try {
    return extractDefaultExport(code);
  } catch (error) {
    return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
  }
};
