/**
 * Normalizes host-rendered HTML so the output of an OLD remote version can be
 * compared against the CURRENT reference. Strips volatile, non-semantic bits
 * that legitimately differ run-to-run (or carry version bookkeeping) while
 * keeping everything that expresses what the component actually rendered
 * (roles, `data-testid`, disabled/aria-disabled, type/name/value, class names,
 * text content).
 *
 * Pure string transform — no DOM — so it runs in a plain node unit test.
 */

/**
 * Matches a React / react-aria generated id token: `react-aria…`, a
 * `useId`-style `:r…:`, or an embedded `_r_…` fragment. These ids are
 * non-deterministic across renders and versions, so any `id` holding one, and
 * any attribute referencing one, is dropped.
 */
const GENERATED_ID = /(?:react-aria[\w-]*|_r_[\w-]*|:r[0-9a-z]+:)/i;

/** Attributes whose value references an element id (may be a generated one). */
const ID_REFERENCE_ATTRIBUTES = [
  "aria-labelledby",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-owns",
  "for",
  "htmlFor",
];

export const normalizeHtml = (html: string): string => {
  let out = html;

  // 1. Remove the hidden connection <iframe> RemoteRenderer renders alongside
  //    the real output — with or without children, and self-closing.
  out = out.replace(/<iframe\b[^>]*?>[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<iframe\b[^>]*?\/?>/gi, "");

  // 2. Remove flr version bookkeeping attributes.
  out = out.replace(/\s+data-flr-version(?:="[^"]*")?/gi, "");
  out = out.replace(/\s+data-flr-initialized(?:="[^"]*")?/gi, "");

  // 3. Drop `id` attributes whose value is a generated id (keep semantic ids).
  out = out.replace(/\s+id="([^"]*)"/gi, (match, value: string) =>
    GENERATED_ID.test(value) ? "" : match,
  );

  // 4. Drop id-reference attributes that point at a generated id.
  for (const attribute of ID_REFERENCE_ATTRIBUTES) {
    const re = new RegExp(`\\s+${attribute}="([^"]*)"`, "gi");
    out = out.replace(re, (match, value: string) =>
      GENERATED_ID.test(value) ? "" : match,
    );
  }

  // 5. Collapse insignificant whitespace between tags.
  out = out.replace(/>\s+</g, "><").trim();

  return out;
};
