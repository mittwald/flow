# @mittwald/flow-core — Agent Guide

Private build and test tooling that every package's `vite.config.ts`,
`vite.build.config.ts` and `vitest.config.ts` builds on: the shared Vitest
browser config (`createVitestBrowserTestConfig`), the declaration options and
checks of the release build (`publishedDtsOptions`, `publishedDeclarations`) and
the rolldown helpers (`libraryBuildChecks`, `preserveUseClientBanner`). See the
[root AGENTS.md](../../AGENTS.md) for repo-wide rules.

## nx wiring

The root AGENTS.md says every nx-orchestrated script needs `dependsOn`, `inputs`
and `outputs`. Three ways to get that wrong without any error:

- **A gitignored file cannot be an `inputs` glob.** nx hashes only files in its
  workspace file map (git-tracked / non-ignored), so a path like
  `{projectRoot}/dist/…` silently contributes nothing to the hash and the task
  serves stale cache on upstream changes.
- **`dependsOn` alone only orders execution**, it does not fold the dependency's
  hash into the dependent. To make a task's hash track a **dependency task's
  output**, use `{ "dependentTasksOutputFiles": "**/*", "transitive": false }`
  (nx hashes its own task outputs).
- **Every file a task produces belongs in `outputs`**, including a gitignored
  sidecar like a `*.tsbuildinfo`. nx restores a cached task's outputs wholesale,
  so a buildinfo left out of the list can survive from one run while `dist` is
  restored from another — after which `tsc` finds it current, emits nothing, and
  the build reports success over an incomplete `dist`.

## Common failures

Symptom → cause → fix for vite/vitest configs, browser test runs and the release
build. Repo-wide ones are in the
[root AGENTS.md](../../AGENTS.md#common-failures).

- **Symptom:** On macOS 27, every Firefox run dies before a single test with
  **`Failed to connect to the browser session … [browser (firefox)]`**,
  `browserType.launch: Failed to launch the browser process`
  (`Could not find profile folder.`) or `Timeout 180000ms exceeded`, while
  WebKit runs fine

  **Cause:** Firefox.app is installed, and macOS 27 then protects
  `~/Library/Application Support/Firefox` — which Playwright's bundled Firefox
  reads at startup
  ([microsoft/playwright#42768](https://github.com/microsoft/playwright/issues/42768),
  fixed in Firefox 158, which no Playwright release ships yet).
  `createVitestBrowserTestConfig()` works around it by pointing `MOZ_APP_DATA`
  at a temp directory, so you only hit this in a vitest config that does not
  call it, or with `MOZ_APP_DATA` already set in your shell. The
  `sandbox_extension_issue_file_to_process` and `RenderCompositorSWGL` lines in
  the log are red herrings

  **Fix:** Build the config on `createVitestBrowserTestConfig()`, or unset
  `MOZ_APP_DATA`. Until Firefox launches, it is no test result — report Firefox
  as unchecked, never as red. To get one regardless, run the suite in the
  Playwright Linux image matching the repo's `playwright` version
  (`mcr.microsoft.com/playwright:v<version>-noble`, the platform CI gates on)
  with its own `pnpm install` — the host's `node_modules` are darwin builds. Pin
  cores with `--cpuset-cpus`, not `--cpus`: vitest sizes its parallelism from
  `nproc`, which `--cpus` leaves at the host's count

- **Symptom:** A vite/vitest config you added floods every build and test run
  with **"Your Vite config uses features that are unsupported by
  `configLoader: 'native'`"**

  **Cause:** Vite is moving to a native (Node) config loader, which resolves
  neither extensionless relative imports nor a directory's `package.json`
  `main`, and needs an import attribute on JSON

  **Fix:** Spell the imports out: `./vite.config.ts` (not `./vite.config`),
  `../core/src/index.ts` (not `../core`),
  `import pkg from "./package.json" with { type: "json" }`. Add
  `"allowImportingTsExtensions": true` to the package's `tsconfig.vite.json` so
  `test:compile` accepts the extensions. The rule reaches everything the config
  imports transitively, `packages/core/src` and `dev/vite/*` included

- **Symptom:** A PostCSS plugin you added to a package's `vite.config.ts`
  behaves differently in the **release build** than in dev, or a plugin you
  added to `vite.build.config.ts` seems to have no effect

  **Cause:** `mergeConfig` **concatenates** `css.postcss.plugins`, so the build
  config runs the dev config's plugins _first_ and then its own. Two plugins
  that transform the same construct silently compose in that order, and nothing
  in the emitted CSS reveals it

  **Fix:** Design the pair to compose (have the earlier plugin step aside when
  it detects the later one via `result.processor.plugins`), or replace
  `css.postcss` after the merge instead of extending it. Assert the built
  artifact, not just the plugin in isolation — a unit test and a test project
  with their own config both stay green while the release build is wrong

- **Symptom:** A **browser** vitest project you added never runs, and the suite
  reports success

  **Cause:** The package's `test:browser` script selects projects by name. A
  bare `--project=browser` matches only that one and silently skips the new one

  **Fix:** Use a glob — `--project=browser*`, as `test:unit` already does with
  `unit*`. (Each project's browser instances come from
  `createVitestBrowserTestConfig()`, which hands out fresh objects per call, so
  the projects cannot collide over their generated names.)

- **Symptom:** A type error you never saw locally sits in the **release
  build's** log — `vite build --config vite.build.config.ts` prints `error TS…`
  and still exits **0**, while `pnpm nx test:compile <pkg>` is green on the same
  tree

  **Cause:** The declaration rollup type-checks under its own program, which is
  not the one `tsc --noEmit` runs, and the plugin reports what it finds without
  failing the task. Nothing downstream looks at it: `pnpm build` succeeds, CI's
  `unit` job runs `test:compile`, and the error reaches nobody. It showed up
  with two copies of one type — `PropertyName` declared both in
  `packages/components` and in `packages/components-base`, whose `DeepKeys<T>`
  conditionals are only comparable when they are the same declaration

  **Fix:** Read the build log after touching types that cross a package boundary
  — `pnpm nx build <pkg> --skip-nx-cache 2>&1 | grep 'error TS'` — and do not
  take a green `test:compile` as the whole answer. A type that two packages both
  need is **re-exported from one of them**, never declared twice

- **Symptom:** A release build fails in `unplugin-dts` with **"Published
  declarations of &lt;pkg&gt;: … imports "&lt;dep&gt;", which &lt;pkg&gt; does
  not declare"**, although `test:compile` is green

  **Cause:** A declaration a consumer can reach — anything the `types` entries
  in `exports` import, transitively — names a package the consumer does not get
  installed: a devDependency, or a private workspace package whose JavaScript
  `externalizeDeps({ except })` inlines. Inside the monorepo the workspace
  symlink resolves it, so no local check notices; a consumer's public type turns
  `any` under `skipLibCheck`, or fails with TS2307 without. The check
  (`packages/core/src/publishedDeclarations.ts`) runs in every package's
  `publishedDtsOptions`

  **Fix:** Declare the package as a dependency or peer if consumers need it
  anyway. For a private workspace package, give it a declaration `build` target
  and wrap the `dts()` options in `withBundledDeclarations()` — see
  `packages/components/vite.build.config.ts` and
  [components-base/AGENTS.md](../components-base/AGENTS.md).
  `acknowledgedUndeclaredTypeImports` holds the pre-existing exceptions; it can
  only shrink
