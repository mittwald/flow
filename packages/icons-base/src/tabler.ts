import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** A single SVG child of an icon: tag name plus its attributes. */
export type TablerIconNode = [
  tag: string,
  attributes: Record<string, string | number>,
][];

export interface TablerIcon {
  /** Selects Tabler's default `<svg>` attribute set. */
  type: "outline" | "filled";
  /** Kebab-case name, used for the `tabler-icon-<name>` class. */
  name: string;
  node: TablerIconNode;
}

/**
 * `@tabler/icons-react` has no `exports` map, so its per-icon modules are
 * importable by path. Each holds exactly the two things we generate from: the
 * `__iconNode` path data and the `createReactComponent` call that names the
 * icon and picks its attribute set.
 */
const modulePath = (vendorIconName: string): string =>
  `@tabler/icons-react/dist/esm/icons/Icon${vendorIconName}.mjs`;

const iconNodePattern = /^const __iconNode = (\[.*]);$/m;
const createComponentPattern =
  /createReactComponent\("(outline|filled)", "([^"]+)", "[^"]+", __iconNode\)/;

const readIconModule = (vendorIconName: string): string => {
  try {
    return readFileSync(require.resolve(modulePath(vendorIconName)), "utf8");
  } catch {
    throw new Error(
      `Tabler icon "${vendorIconName}" not found — no module "${modulePath(vendorIconName)}".`,
    );
  }
};

/**
 * Reads an icon's path data out of `@tabler/icons-react`, so that it can be
 * inlined into the generated icon components instead of being imported at
 * runtime. The package stays a dev dependency; consumers never install it.
 */
export const getTablerIcon = (vendorIconName: string): TablerIcon => {
  const source = readIconModule(vendorIconName);

  const nodeMatch = iconNodePattern.exec(source);
  const componentMatch = createComponentPattern.exec(source);

  if (!nodeMatch?.[1] || !componentMatch?.[1] || !componentMatch[2]) {
    throw new Error(
      `Could not read Tabler icon "${vendorIconName}" from "${modulePath(vendorIconName)}". ` +
        `The layout of @tabler/icons-react has changed — update getTablerIcon().`,
    );
  }

  const node = JSON.parse(nodeMatch[1]) as TablerIconNode;

  return {
    type: componentMatch[1] as TablerIcon["type"],
    name: componentMatch[2],
    // The keys are re-created from the index by `createTablerIcon`.
    node: node.map(([tag, { key: ignoredKey, ...attributes }]) => [
      tag,
      attributes,
    ]),
  };
};
