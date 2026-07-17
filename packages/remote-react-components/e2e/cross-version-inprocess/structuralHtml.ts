/**
 * Structure-only normalization for the in-process cross-version harness.
 *
 * Strips ALL attributes so only the element tree (tag names + nesting + text
 * content) is compared. This is deliberate: the in-process harness runs both
 * sides in one realm, so attribute-level details (serialized prop form, class
 * modifiers, inline styles, icon geometry) drift across versions without that
 * being a backwards-compat break. Comparing structure only gives broad,
 * low-noise coverage of the one thing this harness can assert reliably — does
 * the current host still build the same DOM SHAPE from an old remote version's
 * output? Attribute-level fidelity is the iframe harness's concern instead (see
 * `e2e/cross-version/normalizeHtml.ts`).
 *
 * Pure string transform — no DOM — so it stays a plain node-testable function,
 * like the iframe harness's `normalizeHtml`.
 */
export const structuralHtml = (html: string): string => {
  let out = html;

  // Drop RemoteRenderer's hidden connection <iframe> (no structural meaning).
  out = out.replace(
    /<iframe\b[^>]*\bstyle="[^"]*visibility:\s*hidden[^"]*"[^>]*>[\s\S]*?<\/iframe>/gi,
    "",
  );

  // Strip all attributes from every opening / self-closing tag:
  // `<tag a="1" b>` -> `<tag>`, `<path d="…" />` -> `<path/>`. Closing tags
  // (`</tag>`) start with `/` after `<` and are left untouched.
  out = out.replace(/<([a-zA-Z][\w-]*)\b[^>]*?(\/?)>/g, "<$1$2>");

  // Collapse insignificant whitespace between tags.
  out = out.replace(/>\s+</g, "><").trim();

  return out;
};
