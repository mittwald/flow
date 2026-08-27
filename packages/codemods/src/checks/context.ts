import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import type { CheckContext, Finding } from "./types.js";

/**
 * Ripgrep's `-t ts` type: `.ts`, `.tsx`, `.cts`, `.mts`. Named once here so the
 * 21 detect/verify modules that translate a `rg -t ts '...'` field do not each
 * repeat the list.
 */
export const tsExtensions = [".ts", ".tsx", ".cts", ".mts"];

/**
 * Directories a check must never walk into.
 *
 * Not optional: `upgrade` runs `verify` after an install, so a walk without
 * this excludes a freshly populated `node_modules` — the exact omission that
 * was a Critical on this branch for the codemod runner (see `ignorePattern` in
 * `src/run/jscodeshift.ts`). `dist` and `.git` are excluded for the same
 * reason: build output and VCS internals are not the consumer's code.
 */
const excludedDirs = new Set(["node_modules", "dist", ".git"]);

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = await Promise.all(
    entries.map(async (entry): Promise<string[]> => {
      if (entry.isDirectory()) {
        return excludedDirs.has(entry.name) ? [] : walk(join(dir, entry.name));
      }
      return entry.isFile() ? [join(dir, entry.name)] : [];
    }),
  );
  return found.flat();
};

/**
 * The shared `CheckContext` implementation — the only place under `src/checks`,
 * `src/detect` or `src/verify` that touches the filesystem. Pure Node
 * (`node:fs/promises`, regexes): no `rg`, `grep`, `tsc`, or any other
 * subprocess, so this runs the same on Windows, in a minimal CI container, or
 * without ripgrep installed.
 */
export const createCheckContext = (path: string): CheckContext => {
  const files = async (extensions?: string[]): Promise<string[]> => {
    const all = await walk(path);
    return extensions === undefined
      ? all
      : all.filter((file) => extensions.includes(extname(file)));
  };

  const read = (file: string): Promise<string> => readFile(file, "utf8");

  const search = async (
    pattern: RegExp,
    extensions?: string[],
  ): Promise<Finding[]> => {
    const candidates = await files(extensions);
    // A fresh, non-global copy of `pattern`: `.test()` on a `g`-flagged regex
    // is stateful (it advances `lastIndex`), which would silently skip matches
    // on later lines of the same file, or later files, depending on what the
    // caller passed in.
    const matcher = new RegExp(pattern.source, pattern.flags.replace("g", ""));

    const findings: Finding[] = [];
    for (const file of candidates) {
      let content: string;
      try {
        content = await read(file);
      } catch {
        // Unreadable — permissions, a broken symlink, binary content a strict
        // decode chokes on. A check skips that one file rather than failing
        // the whole run over it.
        continue;
      }
      content.split("\n").forEach((line, index) => {
        if (matcher.test(line)) {
          findings.push({ file, line: index + 1, text: line.trim() });
        }
      });
    }
    return findings;
  };

  return { path, files, read, search };
};
