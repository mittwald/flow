/**
 * Turns the raw SVG an icon may define in `icons.yaml` into data.
 *
 * `icons.yaml` writes those as JSX, because the React generator inlines them
 * into a component. Every other binding needs the same markup as a tree it can
 * build with its own framework's element factory, so it is parsed here once
 * rather than in each generator.
 */

export interface SvgNode {
  tag: string;
  attributes: Record<string, string>;
  children: SvgNode[];
}

/**
 * The SVG attributes that are camelCase in the specification itself.
 *
 * SVG attribute names are case-sensitive, and every presentation attribute is
 * kebab-case — `stroke-width`, not `strokeWidth`. JSX spells those the React
 * way, so any camelCase name _not_ in this list came from React and is
 * converted back. Getting this backwards is silent: the browser ignores an
 * attribute it does not know, and the icon renders unstyled rather than
 * failing.
 */
const camelCaseSvgAttributes = new Set([
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan",
]);

const svgAttributeName = (name: string): string =>
  camelCaseSvgAttributes.has(name) || !/[A-Z]/.test(name)
    ? name
    : name.replace(/[A-Z]/g, (upper) => `-${upper.toLowerCase()}`);

/*
 * Scanned one token at a time rather than matched as whole tags, and **no
 * pattern here ends a quantifier in front of something that can fail** —
 * `\s*>` and `\s*=\s*"` are gone, whitespace is skipped by the loop below
 * instead. Both properties are needed: a single pattern for a tag needs a
 * quantifier over a quantified attribute list, and even `\s*=` backtracks once
 * per space when the `=` never comes. CodeQL rejects both shapes as
 * js/polynomial-redos, and it reports them at the shared `exec` rather than at
 * the pattern — so the whole set has to stay clean, not just the one named.
 *
 * What is left ends in its quantifier (`[\w:.-]*`, `[^\s=/>]+`) or has none,
 * which leaves nothing to backtrack into.
 */
const closeTagPattern = /<\/([a-zA-Z][\w:.-]*)/y;
const openTagPattern = /<([a-zA-Z][\w:.-]*)/y;
const tagEndPattern = /(\/?)>/y;
const attributeNamePattern = /[^\s=/>]+/y;
const whitespacePattern = /\s/;

const matchAt = (
  pattern: RegExp,
  markup: string,
  at: number,
): RegExpExecArray | null => {
  pattern.lastIndex = at;
  return pattern.exec(markup);
};

/** Tested one character at a time, so there is no quantifier to backtrack. */
const skipWhitespace = (markup: string, at: number): number => {
  let next = at;
  while (next < markup.length && whitespacePattern.test(markup[next] ?? "")) {
    next += 1;
  }
  return next;
};

const near = (markup: string, at: number): string =>
  JSON.stringify(markup.slice(at, at + 40));

/**
 * Reads one element's attributes, from just after its tag name up to the `>`.
 *
 * Returns where the tag ended and whether it closed itself.
 */
const readAttributes = (
  markup: string,
  from: number,
  attributes: Record<string, string>,
): { at: number; isSelfClosing: boolean } => {
  let at = from;

  for (;;) {
    at = skipWhitespace(markup, at);

    const end = matchAt(tagEndPattern, markup, at);
    if (end) {
      return { at: at + end[0].length, isSelfClosing: end[1] === "/" };
    }

    const name = matchAt(attributeNamePattern, markup, at);
    if (!name) {
      throw new Error(`Cannot parse SVG attribute at: ${near(markup, at)}.`);
    }
    at += name[0].length;

    at = skipWhitespace(markup, at);
    if (markup[at] !== "=") {
      throw new Error(
        `SVG attribute "${name[0]}" has no value at: ${near(markup, at)}.`,
      );
    }

    at = skipWhitespace(markup, at + 1);
    if (markup[at] !== '"') {
      throw new Error(
        `SVG attribute "${name[0]}" has no double-quoted value at: ${near(markup, at)}.`,
      );
    }
    at += 1;

    /* Scanned with `indexOf`, not `"[^"]*"` — one pass, nothing to backtrack. */
    const valueEnd = markup.indexOf('"', at);
    if (valueEnd === -1) {
      throw new Error(`Unterminated value for SVG attribute "${name[0]}".`);
    }

    attributes[svgAttributeName(name[0])] = markup.slice(at, valueEnd);
    at = valueEnd + 1;
  }
};

/**
 * Parses one SVG element and everything under it.
 *
 * Deliberately strict: it understands elements, double-quoted attributes and
 * whitespace, and throws on anything else — text, entities, single quotes,
 * valueless attributes. `icons.yaml` contains none of those, and a parser that
 * quietly skipped what it did not understand would drop a path rather than say
 * so. The generator runs in CI, so the throw is the report.
 */
export const parseSvg = (markup: string): SvgNode => {
  const roots: SvgNode[] = [];
  const open: SvgNode[] = [];
  let at = skipWhitespace(markup, 0);

  while (at < markup.length) {
    const close = matchAt(closeTagPattern, markup, at);
    if (close) {
      const node = open.pop();
      if (!node || node.tag !== close[1]) {
        throw new Error(
          `Unbalanced SVG markup: </${close[1]}> closes <${node?.tag ?? "nothing"}>.`,
        );
      }

      at = skipWhitespace(markup, at + close[0].length);
      if (markup[at] !== ">") {
        throw new Error(`Unterminated closing tag </${close[1]}.`);
      }
      at = skipWhitespace(markup, at + 1);
      continue;
    }

    const start = matchAt(openTagPattern, markup, at);
    if (!start?.[1]) {
      throw new Error(`Cannot parse SVG markup at: ${near(markup, at)}.`);
    }

    const node: SvgNode = { tag: start[1], attributes: {}, children: [] };
    (open.at(-1)?.children ?? roots).push(node);

    const tag = readAttributes(markup, at + start[0].length, node.attributes);
    if (!tag.isSelfClosing) {
      open.push(node);
    }
    at = skipWhitespace(markup, tag.at);
  }

  if (open.length > 0) {
    throw new Error(`Unclosed SVG element <${open.at(-1)?.tag}>.`);
  }
  if (roots.length !== 1 || !roots[0]) {
    throw new Error(`Expected exactly one root element, got ${roots.length}.`);
  }

  return roots[0];
};
