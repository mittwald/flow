/* global console, process -- Node CLI script */
/*
 * Summarizes a .cpuprofile written by List.profile.perf.tsx:
 *
 *   node dev/perf/analyzeProfile.mjs dev/perf/results/profiles/sort-200.cpuprofile [topN]
 *
 * Dependencies run from vite's pre-bundled chunks, whose function names are
 * mangled; the chunks' source maps (left behind in node_modules/.vite by the
 * last perf run) map them back to the original package and file.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

// Not a dependency of its own: borrowed from postcss, which always has it.
const require = createRequire(import.meta.url);
const { SourceMapConsumer } = createRequire(require.resolve("postcss"))(
  "source-map-js",
);

const [file, topArg] = process.argv.slice(2);
if (!file) {
  console.error("usage: node analyzeProfile.mjs <file.cpuprofile> [topN]");
  process.exit(1);
}
const top = Number(topArg ?? 25);

const depsDir = (() => {
  const base = join(import.meta.dirname, "../../node_modules/.vite/vitest");
  if (!existsSync(base)) return undefined;
  return readdirSync(base)
    .map((d) => join(base, d, "deps"))
    .find((p) => existsSync(p));
})();

const consumers = new Map();
const originalPosition = (callFrame) => {
  const url = callFrame.url.split("?")[0];
  if (!depsDir || !url.includes("/deps/")) return undefined;
  const chunk = url.split("/deps/")[1];
  if (!consumers.has(chunk)) {
    const mapFile = join(depsDir, `${chunk}.map`);
    consumers.set(
      chunk,
      existsSync(mapFile)
        ? new SourceMapConsumer(JSON.parse(readFileSync(mapFile, "utf8")))
        : null,
    );
  }
  const pos = consumers.get(chunk)?.originalPositionFor({
    line: callFrame.lineNumber + 1,
    column: callFrame.columnNumber,
  });
  if (!pos?.source) return undefined;
  return {
    src: pos.source
      .replace(/^.*node_modules\/\.pnpm\/[^/]+\/node_modules\//, "")
      .replace(/^.*node_modules\//, ""),
    line: pos.line,
  };
};

// parcel-style mangled names: $<hash>$export$<hash> → <hash>
const plainName = (name) => name.replace(/^\$[0-9a-f]+\$(export|var)\$/, "");

const label = (node) => {
  const cf = node.callFrame;
  const name = plainName(cf.functionName) || "(anon)";
  const pos = originalPosition(cf);
  if (pos) return `${name}  ${pos.src}:${pos.line}`;
  const url = cf.url.split("?")[0];
  const short = url.includes("/src/")
    ? url.slice(url.indexOf("/src/") + 5)
    : url.split("/").pop();
  return `${name}  ${short}:${cf.lineNumber + 1}`;
};

const packageOf = (node) => {
  const cf = node.callFrame;
  if (cf.functionName === "(garbage collector)") return "(gc)";
  const pos = originalPosition(cf);
  if (pos) return pos.src.match(/^(@[^/]+\/[^/]+|[^/]+)/)[1];
  const url = cf.url;
  if (!url) return "(native)";
  if (url.includes("components-base/src")) return "flow: components-base";
  if (url.includes("react-tunnel")) return "flow: react-tunnel";
  if (url.includes("packages/components/src")) return "flow: components";
  if (url.includes("packages/components/dev")) return "perf fixture";
  return url.split("?")[0].split("/").pop();
};

const profile = JSON.parse(readFileSync(file, "utf8"));
const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
const parent = new Map();
for (const n of profile.nodes) {
  for (const c of n.children ?? []) parent.set(c, n.id);
}

const selfTime = new Map();
for (let i = 0; i < profile.samples.length; i++) {
  const id = profile.samples[i];
  selfTime.set(
    id,
    (selfTime.get(id) ?? 0) + (profile.timeDeltas[i + 1] ?? 0) / 1000,
  );
}

const add = (map, key, t) => map.set(key, (map.get(key) ?? 0) + t);
const byFunction = new Map();
const byPackage = new Map();
const components = new Map();
let busy = 0;

for (const [id, t] of selfTime) {
  const node = nodes.get(id);
  const name = node.callFrame.functionName;
  if (name === "(idle)" || name === "(program)") continue;
  busy += t;
  add(byFunction, label(node), t);
  add(byPackage, packageOf(node), t);

  // Inclusive time of every component/hook on the stack — a component's
  // render cost, since React renders children in separate calls.
  const seen = new Set();
  for (let cur = id; cur !== undefined; cur = parent.get(cur)) {
    const frame = nodes.get(cur);
    const fname = plainName(frame.callFrame.functionName);
    if (/^[A-Z]/.test(fname) || /^use[A-Z]/.test(fname)) {
      const l = label(frame);
      if (!seen.has(l)) {
        seen.add(l);
        add(components, l, t);
      }
    }
  }
}

const table = (map, n) =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(
      ([l, t]) =>
        `${t.toFixed(1).padStart(8)} ms ${((t / busy) * 100).toFixed(1).padStart(5)}%  ${l}`,
    )
    .join("\n");

console.log(`# ${file.split("/").pop()} — busy ${busy.toFixed(1)} ms`);
console.log(`\n## self time by package\n${table(byPackage, 15)}`);
console.log(`\n## self time by function\n${table(byFunction, top)}`);
console.log(`\n## components and hooks, inclusive\n${table(components, top)}`);
