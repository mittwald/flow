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

const openTagPattern =
  /^<([a-zA-Z][\w:.-]*)((?:\s+[^\s=/>]+\s*=\s*"[^"]*")*)\s*(\/?)>/;
const closeTagPattern = /^<\/([a-zA-Z][\w:.-]*)\s*>/;
const attributePattern = /([^\s=/>]+)\s*=\s*"([^"]*)"/g;

const readAttributes = (source: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const [, name, value] of source.matchAll(attributePattern)) {
    attributes[svgAttributeName(name as string)] = value as string;
  }
  return attributes;
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
  let rest = markup.trim();

  while (rest.length > 0) {
    const close = closeTagPattern.exec(rest);
    if (close) {
      const node = open.pop();
      if (!node || node.tag !== close[1]) {
        throw new Error(
          `Unbalanced SVG markup: </${close[1]}> closes <${node?.tag ?? "nothing"}>.`,
        );
      }
      rest = rest.slice(close[0].length).trimStart();
      continue;
    }

    const start = openTagPattern.exec(rest);
    if (!start?.[1]) {
      throw new Error(
        `Cannot parse SVG markup at: ${JSON.stringify(rest.slice(0, 40))}.`,
      );
    }

    const node: SvgNode = {
      tag: start[1],
      attributes: readAttributes(start[2] ?? ""),
      children: [],
    };
    (open.at(-1)?.children ?? roots).push(node);
    if (start[3] !== "/") {
      open.push(node);
    }
    rest = rest.slice(start[0].length).trimStart();
  }

  if (open.length > 0) {
    throw new Error(`Unclosed SVG element <${open.at(-1)?.tag}>.`);
  }
  if (roots.length !== 1 || !roots[0]) {
    throw new Error(`Expected exactly one root element, got ${roots.length}.`);
  }

  return roots[0];
};
