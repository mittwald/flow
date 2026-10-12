import fs from "node:fs";
import path from "node:path";
import { cssModuleClassNameGenerator } from "../vite/cssModuleClassNameGenerator.ts";

const componentsSrc = path.resolve(import.meta.dirname, "../../src");

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(child, files);
    } else if (/\.module\.d\.s?css\.ts$/.test(entry.name)) {
      files.push(child);
    }
  }

  return files;
};

/** Every class name a stylesheet names inside a `:global(…)`. */
const globalTargetsOf = (stylesheet) => {
  const targets = new Set();

  for (const [, inner] of fs
    .readFileSync(stylesheet, "utf8")
    .matchAll(/:global\(([^)]*)\)/g)) {
    for (const [, className] of inner.matchAll(/\.([\w-]+)/g)) {
      targets.add(className);
    }
  }

  return targets;
};

/**
 * Every `flow--…` class the component build emits, derived from the committed
 * `*.module.d.scss.ts` stubs — the only source that also lists classes a mixin
 * or an interpolation produces — run through the very generator the build uses.
 * Reading the built `dist/css/all.css` instead would be circular: a `:global()`
 * selector is emitted verbatim, so a broken reference would find itself there.
 *
 * A stub lists every class its stylesheet mentions, its `:global()` targets
 * included, and those are not local classes: scoping `react-aria-Heading` from
 * `Calendar` would invent `flow--calendar--react-aria-heading`, which nothing
 * generates but a typo could name. They are therefore excluded by looking them
 * up in the stylesheet. A name used both ways would be dropped too — that
 * direction is the safe one, because a wrong exclusion only rejects a valid
 * reference, loudly, while a wrong inclusion silently reopens the hole this
 * rule exists to close.
 */
export const collectKnownFlowClasses = (src = componentsSrc) => {
  const known = new Set();

  for (const stub of walk(src)) {
    const stylesheet = stub.replace(/\.d\.(s?css)\.ts$/, ".$1");
    const globalTargets = globalTargetsOf(stylesheet);

    for (const [, quoted, bare] of fs
      .readFileSync(stub, "utf8")
      .matchAll(/readonly\s+(?:"([^"]+)"|([\w$]+))\s*:/g)) {
      const localName = quoted ?? bare;

      if (globalTargets.has(localName)) {
        continue;
      }

      known.add(cssModuleClassNameGenerator(localName, stylesheet));
    }
  }

  return known;
};

const stubsSignature = () => {
  const stubs = walk(componentsSrc);
  const newest = Math.max(...stubs.map((stub) => fs.statSync(stub).mtimeMs));
  return `${stubs.length}:${newest}`;
};

let cached;

/**
 * {@link collectKnownFlowClasses}, shared by both lint rules and refreshed when
 * the stubs change. Editor lint servers live for hours, so a cache that never
 * expires keeps rejecting a class after its stubs were regenerated. The stubs
 * are checked at most once a second, which keeps a CLI run from re-walking the
 * tree for every file.
 */
export const knownFlowClasses = () => {
  const now = Date.now();

  if (cached && now - cached.checkedAt < 1000) {
    return cached.classes;
  }

  const signature = stubsSignature();

  if (cached?.signature !== signature) {
    cached = { signature, classes: collectKnownFlowClasses() };
  }

  cached.checkedAt = now;
  return cached.classes;
};

/** Levenshtein distance, capped — only used to name a likely typo. */
const distance = (a, b) => {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];

    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }

    previous = current;
  }

  return previous[b.length];
};

/** The known class closest to `className`, if any is close enough. */
export const suggestionFor = (className, known) => {
  let best;
  let bestDistance = Math.ceil(className.length / 3);

  for (const candidate of known) {
    const candidateDistance = distance(className, candidate);

    if (candidateDistance <= bestDistance) {
      best = candidate;
      bestDistance = candidateDistance;
    }
  }

  return best;
};
