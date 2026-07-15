import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface Target {
  category: string;
  version: string;
}

const here = dirname(fileURLToPath(import.meta.url));
// Real, non-virtual helper file holding the JSX-heavy render wiring — see the
// comment at the top of that file for why the JSX cannot live inline in this
// generated module.
const helperPath = join(here, "renderRemoteVersion.tsx");

/**
 * FIDELITY NOTE — read before treating a green cross-version run as proof of
 * backward compatibility:
 *
 * This harness pairs the OLD, isolated-npm-installed
 * `@mittwald/flow-remote-react-components` (React/prop API) and OLD
 * `@mittwald/flow-remote-core` (serialization/connection protocol) against the
 * CURRENT host's `RemoteRenderer`/`RemoteReceiver`. It validates that
 * combination only.
 *
 * It deliberately does NOT exercise OLD `@mittwald/flow-remote-elements`
 * internals: the cross-version vitest config aliases the bare
 * `@mittwald/flow-remote-elements` specifier to the CURRENT workspace copy (see
 * `sharedRemoteElementsAlias` in `vitest.config.ts`) to avoid a same-realm
 * `customElements.define` collision between the old and current copies loaded
 * into one JS realm. So a passing test here says nothing about whether a change
 * to `remote-elements` itself is backward compatible — do not cite a green run
 * as evidence for that.
 *
 * Generates one `testEnvironments` entry per manifest target: each renders
 * through the OLD `RemoteRoot` + OLD remote components (via the per-version
 * `@flr-crossversion/<version>` alias from Task 4) paired with the CURRENT host
 * `RemoteRenderer`/`RemoteReceiver`, screenshotting against the SAME baselines
 * the normal `Remote`/`Local` environments use (the description string passed
 * to `testScreenshot` is forwarded unmodified — only the env's `toString()`
 * differs, which affects the test title, never the screenshot filename).
 *
 * WHY THIS WRITES A REAL FILE INSTEAD OF A VIRTUAL MODULE, AND A KNOWN
 * COLD-CACHE LIMITATION (read before debugging a flaky first run):
 *
 * The brief's Step 1 asked for a Vite _virtual_-module plugin (`resolveId` /
 * `load` returning a `\0`-prefixed id). That was implemented first and worked
 * for alias precedence and for the JSX-transform problem (solved by delegating
 * JSX to the real `renderRemoteVersion.tsx` helper below). But on a cold
 * `node_modules/.vite` cache it needed **two** throwaway runs before results
 * stabilized: the first cold run failed to even import the test file
 * ("Importing a module script failed"), and the very next run failed with
 * `Invalid hook call` / `null is not an object (evaluating
 * 'resolveDispatcher().useState')` — a duplicate-React symptom — before a third
 * run went green.
 *
 * Suspecting the `\0`-prefixed virtual id was invisible to Vite's dependency
 * _scanner_ (the esbuild pre-pass that decides what to pre-bundle before the
 * browser loads a page), this module was switched to writing a REAL file to
 * disk instead (its current form). That did NOT eliminate the two-run pattern —
 * it persisted identically for a real file imported via this exact same alias,
 * and even for a real file imported via a plain RELATIVE import with no alias
 * involved at all. The actual cause, confirmed by a hand-written test file with
 * byte-for-byte identical render/import logic INLINED directly in the test file
 * (which passed on every run, cold or warm): the scanner only inspects a
 * matched test file's OWN literal `import` statements — it does not trace
 * transitively into further files that file imports from, virtual or real. Each
 * generated env does `import * as Components_i from
 * "@flr-crossversion/<version>"` — a full barrel pulling in dozens of that OLD
 * version's own transitive third-party deps (codemirror, recharts, table libs,
 * etc.), and those are only discovered _lazily_, mid test-run, whenever they're
 * reached only through an indirection like this one. That triggers Vite's
 * "optimized dependencies changed, reloading" cache invalidation while a test
 * is in flight.
 *
 * This is inherent to the design goal (shared `testEnvironments` injected via
 * `@/tests/lib/environments` so ordinary subset test files stay unmodified) and
 * could not be designed away — see the matching comment on `optimizeDeps` in
 * `vitest.config.ts` for why brute-forcing the missing deps into
 * `optimizeDeps.include` doesn't work either (they aren't resolvable from this
 * package's node_modules under pnpm's strict, non-hoisted layout).
 *
 * PRACTICAL IMPACT: on a genuinely cold cache (a fresh CI checkout, no warm
 * `node_modules/.vite`) expect the first run to fail with a mid-run reload, and
 * the run immediately after that to fail with a transient duplicate-React
 * error. The run after THAT is reliably green, and stays green as long as the
 * cache is warm. Task 6/8's CI wiring MUST budget for (at minimum) one
 * discarded warm-up run before asserting on results — see the progress ledger's
 * Task 5 entry for this carry-forward.
 *
 * Kept as a real file (rather than reverting to a virtual module) anyway
 * because it is otherwise strictly simpler to reason about and debug: the
 * generated source can be opened directly at
 * `dev/cross-version/.generated/environments.ts`, and it removes the virtual-id
 * blind spot as at least one variable from an already exotic failure mode, even
 * though the deeper cause is unrelated to virtual vs. real.
 */
export const GENERATED_ENVIRONMENTS_DIR_NAME = ".generated";
const GENERATED_FILE_NAME = "environments.ts";

/**
 * Writes the generated `testEnvironments` module to
 * `dev/cross-version/.generated/environments.ts` and returns its absolute path
 * (for use as an alias replacement). Synchronous and idempotent — safe to call
 * at vitest-config module-evaluation time.
 */
export function writeCrossVersionEnvironmentsModule(targets: Target[]): string {
  const outDir = join(here, GENERATED_ENVIRONMENTS_DIR_NAME);
  const outFile = join(outDir, GENERATED_FILE_NAME);
  mkdirSync(outDir, { recursive: true });

  const imports = targets
    .map(
      (t, i) => `
import RemoteRoot_${i} from "@flr-crossversion/${t.version}/RemoteRoot";
import * as Components_${i} from "@flr-crossversion/${t.version}";`,
    )
    .join("");

  const envs = targets
    .map(
      (t, i) => `
  {
    toString: () => ${JSON.stringify(`Remote@${t.version}`)},
    components: Components_${i},
    render: makeRenderRemote(RemoteRoot_${i}),
    container: rootContainerLocator,
    testScreenshot,
  },`,
    )
    .join("");

  const source = `// AUTO-GENERATED by crossVersionEnvironmentsPlugin.ts — do not edit, not committed.
// See the fidelity + rationale comment at the top of that file.
import { makeRenderRemote, testScreenshot, rootContainerLocator } from ${JSON.stringify(helperPath)};
${imports}

export const testEnvironments = [${envs}
];
`;

  writeFileSync(outFile, source, "utf8");
  return outFile;
}
