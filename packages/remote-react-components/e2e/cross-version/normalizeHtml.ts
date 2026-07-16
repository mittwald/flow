/**
 * Normalizes host-rendered HTML so the output of an OLD remote version can be
 * compared against the CURRENT reference. Strips volatile, run-to-run bits (and
 * version bookkeeping) while keeping everything that expresses what the
 * component actually rendered — roles, `data-testid`, disabled/aria-disabled,
 * type/name/value, class names, text content, AND the label↔control wiring
 * (attribute presence + which reference points at which id).
 *
 * Crucially, generated ids are REWRITTEN to stable placeholders rather than
 * deleted: deleting them would make "attribute present, pointing at a generated
 * id" indistinguishable from "attribute absent", masking real
 * label/description-association regressions. Rewriting preserves both the
 * presence of the attribute and the cross-reference (a `for` and the `id` it
 * targets get the SAME placeholder).
 *
 * Pure string transform — no DOM — so it runs in a plain node unit test.
 */

/**
 * Full-VALUE-token match for a React / react-aria generated id: `react-aria…`,
 * a `useId`-style `:r…:`, or an embedded `_r_…` fragment. Anchored so an
 * author-set id/value that merely CONTAINS such a substring is not treated as
 * generated. Applied per whitespace-separated token, since id-reference
 * attributes (e.g. `aria-labelledby`) may hold several ids.
 */
const GENERATED_ID_TOKEN = /^(?:react-aria[\w-]*|_r_[\w-]*|:r[0-9a-z]+:)$/i;

/**
 * Attributes that hold element ids (a single id, or — for the aria-* ones — a
 * whitespace-separated list). Their generated id tokens are rewritten to
 * placeholders; non-generated tokens are left untouched. `data-collection` is
 * react-aria's internal collection id, volatile per render, so it is normalized
 * too.
 */
const ID_ATTRIBUTES = [
  "id",
  "for",
  "htmlFor",
  "aria-labelledby",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-owns",
  "data-collection",
];

const idAttributePattern = new RegExp(
  `(\\s(?:${ID_ATTRIBUTES.join("|")})=")([^"]*)(")`,
  "gi",
);

export const normalizeHtml = (html: string): string => {
  let out = html;

  // 1. Remove ONLY RemoteRenderer's hidden connection <iframe> — identified by
  //    its inline `visibility: hidden` style (it carries no class/id/data
  //    marker). A real iframe rendered by a component must survive.
  out = out.replace(
    /<iframe\b[^>]*\bstyle="[^"]*visibility:\s*hidden[^"]*"[^>]*>[\s\S]*?<\/iframe>/gi,
    "",
  );

  // 2. Remove flr version bookkeeping attributes.
  out = out.replace(/\s+data-flr-version(?:="[^"]*")?/gi, "");
  out = out.replace(/\s+data-flr-initialized(?:="[^"]*")?/gi, "");

  // 3. Rewrite generated id VALUES to stable, position-based placeholders,
  //    consistently across every attribute that references the same id. The
  //    global replace visits matches left-to-right, so numbering follows first
  //    appearance in the string and is deterministic. Attribute presence and
  //    cross-references are preserved; only the volatile suffix is normalized.
  const placeholders = new Map<string, string>();
  const placeholderFor = (id: string): string => {
    const existing = placeholders.get(id);
    if (existing !== undefined) {
      return existing;
    }
    const token = `GENERATED_ID_${placeholders.size + 1}`;
    placeholders.set(id, token);
    return token;
  };

  out = out.replace(
    idAttributePattern,
    (_match, prefix, value: string, suffix) => {
      const rewritten = value
        .split(/\s+/)
        .map((token) =>
          GENERATED_ID_TOKEN.test(token) ? placeholderFor(token) : token,
        )
        .join(" ");
      return `${prefix}${rewritten}${suffix}`;
    },
  );

  // 4. Normalize the loading spinner's time-based animation offset — it is
  //    derived per render (e.g. `--animation-delay: -1499ms`), so it differs
  //    run-to-run and is not a semantic difference.
  out = out.replace(
    /--animation-delay:\s*-?[\d.]+ms/gi,
    "--animation-delay: 0ms",
  );

  // 5. Collapse insignificant whitespace between tags. NOTE: this assumes
  //    block-level component boundaries (whitespace between tags is not
  //    meaningful). An inline-composition entry where a space between adjacent
  //    inline elements is significant would need a more careful rule.
  out = out.replace(/>\s+</g, "><").trim();

  return out;
};
