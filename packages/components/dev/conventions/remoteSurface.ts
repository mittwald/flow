import { readFileSync } from "node:fs";
import { basename, relative } from "node:path";
import { globSync } from "glob";

export const srcDir = new URL("../../src/", import.meta.url).pathname;

const sourceFiles = (pattern: string): string[] =>
  globSync(pattern, {
    cwd: srcDir,
    absolute: true,
    ignore: [
      "views/**",
      "**/auto-generated/**",
      "**/*.stories.tsx",
      "**/*.test.{ts,tsx}",
      "**/*.test-types.tsx",
    ],
  });

export const relativeToSrc = (file: string): string =>
  `src/${relative(srcDir, file)}`;

/**
 * Components tagged `@flr-generate`, by the name they are generated under. The
 * tag sits on the component const, so the file it lives in names it —
 * `flow/flow-component-name` keeps the registered name and the file in sync.
 */
export const flrGenerateComponents = (): Set<string> => {
  const components = new Set<string>();

  for (const file of sourceFiles("**/*.tsx")) {
    if (readFileSync(file, "utf8").includes("@flr-generate")) {
      components.add(basename(file, ".tsx"));
    }
  }

  return components;
};

/**
 * Value exports of `src/index/flr-universal.ts` — components the remote app
 * renders itself, as opposed to the `@flr-generate` ones the host materializes
 * from an `flr-*` element. Types are left out: only a value can be rendered.
 */
export const flrUniversalExports = (): Set<string> => {
  const source = readFileSync(`${srcDir}index/flr-universal.ts`, "utf8");
  const exports = new Set<string>();

  for (const block of source.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const entry of block[1].split(",")) {
      const name = entry.trim();
      if (name && !name.startsWith("type ")) {
        exports.add(name.split(/\s+as\s+/).pop() as string);
      }
    }
  }

  return exports;
};

export interface PropsContextKey {
  key: string;
  file: string;
}

/**
 * The top-level keys of every `PropsContext` object literal. Each one names the
 * component the entry configures.
 */
export const propsContextKeys = (): PropsContextKey[] => {
  const keys: PropsContextKey[] = [];

  for (const file of sourceFiles("**/*.{ts,tsx}")) {
    const source = readFileSync(file, "utf8");

    for (const match of source.matchAll(/:\s*PropsContext\s*=\s*\{/g)) {
      const start = match.index + match[0].length;
      const body = source.slice(start, matchingBrace(source, start - 1));

      for (const key of topLevelKeys(body)) {
        keys.push({ key, file: relativeToSrc(file) });
      }
    }
  }

  return keys;
};

/** Index of the `}` closing the `{` at `openingBrace`. */
const matchingBrace = (source: string, openingBrace: number): number => {
  let depth = 0;

  for (let i = openingBrace; i < source.length; i++) {
    if (source[i] === "{") {
      depth++;
    } else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }

  return source.length;
};

/** Keys of an object literal body, skipping anything nested inside a value. */
const topLevelKeys = (body: string): string[] => {
  const keys: string[] = [];
  let depth = 0;

  for (let i = 0; i < body.length; i++) {
    const character = body[i];

    if ("{[(".includes(character)) {
      depth++;
    } else if ("}])".includes(character)) {
      depth--;
    }

    if (depth === 0) {
      const key = body.slice(i).match(/^\n\s*(\w+)\s*:/);
      if (key) {
        keys.push(key[1]);
      }
    }
  }

  return keys;
};
