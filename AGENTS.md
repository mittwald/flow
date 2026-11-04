# mittwald Flow — Agent Guide

**Building an app or mStudio extension in your own project?** Read
[packages/components/USAGE.md](packages/components/USAGE.md) first. Everything
below is for changing Flow.

Canonical guidance for AI coding agents (and a good primer for humans) working
in this repository. Package-specific deep dives live next to the code — see
[Where to look next](#where-to-look-next).

## What this project is

mittwald **Flow** is the design system of [mittwald](https://www.mittwald.de): a
React component library plus a remote-DOM rendering system that lets
[mStudio](https://developer.mittwald.de) extensions render sandboxed UI inside
the mittwald backoffice using real Flow components.

- User documentation: <https://flow.mittwald.de>
- Storybook: <https://storybook.flow-components.de>
- Remote rendering is based on a fork of
  [Shopify remote-dom](https://github.com/Shopify/remote-dom)

## The three systems

### 1. Design system core

React components in `packages/components` (most wrap
[react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html)
for accessibility), styled with SCSS modules and design-token CSS variables.
Icon sets, a standalone stylesheet package, and the docs site build on top of
it. Patterns are documented in
[packages/components/AGENTS.md](packages/components/AGENTS.md).

### 2. Remote DOM ("flr" = **Fl**ow **R**emote)

mStudio extensions run in a hidden iframe and render UI that the host
materializes with real Flow components. For the full picture — end-to-end flow,
the mental model, and what remote-capability means when you implement a
component — see [docs/remote-ui.md](docs/remote-ui.md).

```
extension (iframe)                          host (mStudio)
RemoteRoot + remote components        ───►  RemoteRenderer + RemoteReceiver
   │  @quilted/threads connection              │
   └─ hidden remote DOM (flr-* elements) ───►  maps flr-* to Flow components
```

**The extension side is one binding per framework**, all maintained here: React
is the reference (`remote-react-components`), Vue the second
(`remote-vue-components`, **beta**). The host is React whatever the extension is
written in. `@flr-generate` props and icons reach every binding by generator. A
`flr-universal` composition (`Modal`, `List`) and the class names and UI strings
it uses are rebuilt **by hand** in each binding, and the **`parity` CI job**
gates them. What a change costs per binding and what the gate covers:
[docs/remote-framework-bindings.md](docs/remote-framework-bindings.md#what-a-change-costs-per-binding).

- `remote-core` owns connection + serialization (`@quilted/threads`). The
  protocol is **versioned** — the host negotiates with different remote versions
  at connection time. Keep this layer backwards compatible.
- Components tagged `/** @flr-generate all */` get generated artifacts: a
  `view.ts` next to the component, view components in
  `packages/components/src/views/`, and files under `src/auto-generated/` in
  `remote-elements`, `remote-react-components`, `remote-react-renderer` and
  `remote-vue-components`.
- **Props of `@flr-generate` components are a contract with extension
  developers.** Avoid breaking changes on `stable` components (`beta` is exempt
  — see [Hard rules](#hard-rules)). When an API must change, keep the old path
  working and log usage with `useWarnDeprecation` (from
  `DeprecationWarningProvider`) so extension developers can be informed about
  deprecation paths they still use. `useWarnDeprecation` is the standard way to
  flag any deprecated runtime path — see
  [Deprecating an API](packages/components/AGENTS.md#deprecating-an-api).
- Inside components that are part of the `flr-universal` export surface, compose
  other Flow components through their **views** (`@/views/*`) — views
  automatically switch to the remote counterpart in a remote context.

### 3. Token pipeline

`design-tokens` YAML files are defined together with UX — **design authority**.
Base tokens (colors, font, sizes, …) are taboo — never invent or modify them.
Adding **component tokens** for a new component is fine: model them on existing
components and ask when unsure. [style-dictionary](https://styledictionary.com/)
compiles YAML → `dist/css` (CSS variables), `dist/json` (full, with build
metadata) and `dist/json-runtime` (values only — what browser bundles import).

## Repository map

nx + pnpm workspace monorepo. Node `>=24`, pnpm pinned via `packageManager` (use
corepack). Several packages ship their own `AGENTS.md` — **always read the
nearest `AGENTS.md` before working in a package.**

| Path                                    | Package                                  | Role                                                                                       |
| --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `packages/components`                   | `@mittwald/flow-react-components`        | The heart: all React components.                                                           |
| `packages/design-tokens`                | `@mittwald/flow-design-tokens`           | Token source (YAML, design authority) → CSS vars + JSON via style-dictionary.              |
| `packages/icons-base`                   | private                                  | Icon source of truth (`src/icons.yaml`) + shared generator tooling.                        |
| `packages/icons`, `packages/icons-pro`  | `@mittwald/flow-icons(-pro)`             | Published icon sets, **fully generated** from `icons-base` (Tabler / FontAwesome).         |
| `packages/stylesheet`                   | `@mittwald/flow-stylesheet`              | Publishes the components' `all.css` as a standalone CSS package.                           |
| `packages/core`                         | private                                  | Shared build and test tooling: Vitest browser config, release-build declaration checks.    |
| `packages/components-base`              | private                                  | Framework-agnostic component logic (MobX) shared by the React and Vue bindings.            |
| `packages/remote-core`                  | `@mittwald/flow-remote-core`             | Connection + serialization layer (versioned protocol).                                     |
| `packages/remote-elements`              | `@mittwald/flow-remote-elements`         | Custom elements (`flr-*`) for the remote side; largely auto-generated.                     |
| `packages/remote-react-components`      | `@mittwald/flow-remote-react-components` | React API used _inside_ remote apps (extensions); largely auto-generated.                  |
| `packages/remote-react-renderer`        | `@mittwald/flow-remote-react-renderer`   | Host-side renderer mapping `flr-*` elements to Flow components; map auto-generated.        |
| `packages/remote-vue-components`        | `@mittwald/flow-remote-vue-components`   | **Beta.** Vue API for remote apps; mirrors the React one, partly generated.                |
| `packages/ext-bridge`                   | `@mittwald/ext-bridge`                   | mStudio extension bridge (node/browser/react/i18next entries). Remote host config contract |
| `packages/react-tunnel`                 | `@mittwald/react-tunnel`                 | Generic "portal for components" utility (MobX-based).                                      |
| `packages/mstudio-ext-react-components` | `@mittwald/mstudio-ext-react-components` | Helpers for extension developers (mStudio page header customization).                      |
| `packages/codemods`                     | `@mittwald/flow-codemods`                | The `upgrade` CLI and the migration catalogue that generates `MIGRATION.md`.               |
| `packages/typescript-config`            | private                                  | Shared tsconfig presets (`base`, `library`, `web-library`, `react-library`, `nextjs`).     |
| `apps/docs`                             | private                                  | User documentation site (Next.js); content in `src/content`, deployed to flow.mittwald.de. |
| `apps/remote-dom-demo`                  | private                                  | Demo app for remote rendering. Remote-capable components should have a demo here.          |

## Technology stack

- [nx](https://nx.dev/) — task orchestration (`affected`, caching, target deps)
- [pnpm](https://pnpm.io/) — workspace package manager
- [lerna-lite](https://github.com/lerna-lite/lerna-lite) — only used for
  publishing (versioning + changelogs from conventional commits)
- [Vite](https://vite.dev/) — component build; [vitest](https://vitest.dev/)
  incl. [browser mode](https://vitest.dev/guide/browser/) (Playwright-backed)
- [Storybook](https://storybook.js.org/) — component dev environment
- [react-aria-components](https://react-spectrum.adobe.com/react-aria/components.html)
  — accessibility foundation
- [style-dictionary](https://styledictionary.com/) — design token compilation
- [SCSS modules](https://github.com/css-modules/css-modules) — component styling
- [jscodeshift](https://github.com/facebook/jscodeshift) — consumer codemods

## Commands

```shell
corepack enable && pnpm install            # setup
pnpm nx dev components                     # component dev env (Storybook, :6006)
pnpm build                                 # build everything (runs all generators)

pnpm test                                  # all unit + compile + link tests
pnpm affected:test                         # only affected vs. main (what CI runs)
pnpm nx test:unit components               # unit tests for one package
pnpm nx test:compile components            # tsc --noEmit for one package

pnpm test:browser:prepare                  # install Playwright browsers + system deps
pnpm nx test:browser components --browser.name=webkit
pnpm nx test:browser components -- --browser.name=webkit src/components/Button  # filtered: flags after --
pnpm affected:test:browser --parallel=1 --browser.name=webkit   # browser/e2e/visual
pnpm nx test:visual:update remote-react-components              # update visual snapshots

pnpm lint                                  # eslint + stylelint + format:check (pre-push hook runs this)
pnpm format                                # prettier --write
pnpm format:check                          # prettier --check (part of pnpm lint)
```

## Generated code — must be committed

CI enforces `git diff --exit-code` after building: **generated files are
committed, and hand-editing them is futile** (headers say "auto-generated").

| Generated artifact                                                                                                                                        | Generator                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/components/src/components/**/view.ts` + `src/views/*`                                                                                           | `pnpm nx build:remote-components components`                       |
| `packages/remote-{elements,react-components,react-renderer,vue-components}/src/auto-generated/**`                                                         | same as above                                                      |
| `packages/components/src/**/*.module.d.scss.ts`, `apps/{docs,remote-dom-demo}/src/**/*.module.d.{scss,css}.ts` (CSS-module class-name types)              | `pnpm nx build:scss-types components` / `docs` / `remote-dom-demo` |
| `packages/components/src/components/Icon/components/icons/*`                                                                                              | `pnpm nx build:icons components`                                   |
| `packages/remote-vue-components/src/icons/{components/*,iconNames.ts}`                                                                                    | `pnpm nx build:icons remote-vue-components`                        |
| `packages/icons/src/components/*`, `packages/icons-pro/src/components/*`                                                                                  | `pnpm nx build:icons icons` / `icons-pro`                          |
| `packages/components/.cache/doc-properties.json` (build input) + `dist/assets/doc-properties.json` (published, consumer props only), both from prop JSDoc | `pnpm nx build:docs-properties components`                         |
| `packages/components/dist/assets/component-index.json` (consumer-facing index)                                                                            | `pnpm nx build:component-index components`                         |
| `packages/components/MIGRATION.md` + `packages/codemods/src/migrations.generated.ts`                                                                      | `pnpm nx build codemods`                                           |
| `packages/codemods/src/flowPackages.generated.ts`                                                                                                         | same as above                                                      |

Changed props on an `@flr-generate` component, added an icon, **bumped
`@tabler/icons-react`** (its path data is inlined into `packages/icons` — see
[icons-base/AGENTS.md](packages/icons-base/AGENTS.md)), edited prop JSDoc, or
changed a `.module.scss`'s class names? Regenerate (or simply `pnpm build`) and
commit the results.

## Development workflow

- **Conventional Commits** with component/package scope — `fix(Button): …`,
  `feat(components): …`. Releases and changelogs are generated from them.
- Merged PRs trigger the publish workflow (lerna-lite, fixed versioning across
  packages) — **unless nothing in the merge can reach a consumer** (docs, CI,
  repo tooling, tests, stories), which publishes nothing at all. The rule lives
  in `.github/scripts/release-relevance-lib.mjs`; the exact path list is in
  [docs/release-workflow.md](docs/release-workflow.md).
- **A PR that finishes an issue must say `Closes #<n>` in its body** — on
  `main`, `next` and the major line. Without it the issue stays open after the
  work ships.
  - `Part of #<n>` only while work on the issue remains. The PR that finishes it
    — often the last of a series — says `Closes`. #3491 finished #3303 with
    `Part of #3303`, so someone had to close it by hand.
  - Before opening a PR, search the open issues for one the change finishes,
    even when nobody named one.
  - GitHub resolves the keyword only on the default branch (`main`);
    `.github/workflows/close-linked-issues.yml` closes the issues when a PR
    merges into `next`. A major line (`2.x`) has to be added to its `branches:`
    when it opens
    ([runbook step 6](docs/major-line-runbook.md#6-close-linked-issuesyml--the-branch-filter)).
- **Maintain the nx wiring for scripts.** Every package script that nx
  orchestrates needs correct target metadata: `dependsOn` (ordering),
  `inputs`/`outputs` (caching, affected detection) in the package's
  `project.json` or in `nx.json` targetDefaults. When adding a script or a new
  generated artifact, wire these up — otherwise caching serves stale results and
  `nx affected` misses work. Three ways to get it wrong silently (gitignored
  inputs, dependency outputs, unlisted sidecar outputs):
  [packages/core/AGENTS.md](packages/core/AGENTS.md#nx-wiring).
- **Git hooks** live in `.githooks/`: `post-checkout` (branch checkouts only)
  and `post-merge` run `pnpm install` — expect installs after switching
  branches. `pre-push` runs `pnpm lint` — which includes `format:check`, so a
  stray unformatted `.md`/`.json`/`.yml` blocks the push, not the commit;
  `pnpm format` fixes it. `SKIP_GIT_HOOKS=1` skips any of them. The root
  `prepare` points git at them (`core.hooksPath`, via
  `.github/scripts/init-git-hooks.cjs`) and skips CI: on a runner a `pre-push`
  lint aborted pushes after a publish had already happened (#2932).
- **New dependencies:** pnpm enforces a `minimumReleaseAge` of one week (exempt:
  `@mittwald/*`) — brand-new versions won't resolve.
- **Dependency updates run themselves.** Dependabot opens four grouped npm PRs a
  week and merges them itself once CI and the full visual and cross-version
  suites are green — see
  [CONTRIBUTE.md § Dependency updates](CONTRIBUTE.md#dependency-updates). A
  deliberate hold belongs in `.github/dependabot.yml` as an `ignore` entry; a
  closed PR only makes it come back next week.
- **Breaking changes for consumers** ship with a **catalogue entry** in
  `packages/codemods/src/migrations` — which generates the `MIGRATION.md` entry
  — and a codemod when the change is mechanically decidable. The entry's `apply`
  field is the instruction an agent executes; fill it even when there is no
  codemod, because for those entries it is the whole migration. Exception: a
  break in a **beta package** (`"flowStatus": "beta"`) gets a migration note in
  the commit body and release notes instead
  ([ADR 0007](docs/adr/0007-beta-packages.md)).
- `patches/` contains intentional pnpm dependency patches — leave them alone.
- **Browser support:** all three engines (Chromium, Firefox, WebKit). CI driving
  WebKit, plus a non-blocking Firefox job for the browser tests, is a pragmatic
  choice, not a support statement.

## Definition of Done — component work

A new or substantially changed component comes with:

1. Implementation following the patterns in
   [packages/components/AGENTS.md](packages/components/AGENTS.md)
2. Stories: `stories/Default.stories.tsx` with realistic args and meaningful
   variants
3. A docs page in `apps/docs/src/content/components/<category>/…`
4. Tests along the testing bar: unit tests for lib functions, browser tests for
   behavior (see the components AGENTS.md testing section). **New or changed
   rendered behavior (a new prop, variant, or layout that affects the visual
   output) gets an added or extended visual test in
   `packages/remote-react-components/src/tests/visual` — it runs in both the
   `Local` and `Remote` environments and guards the whole path.** The browser
   also picks the theme (webkit = light, firefox = dark), so a full run covers
   both themes. **A form field passes `testFormFieldContract`** — see
   [Building a form field](packages/components/AGENTS.md#building-a-form-field).
5. UI text in `locales/de-DE.locale.json` **and** `locales/en-US.locale.json`
   (import pattern: i18n section of
   [packages/components/AGENTS.md](packages/components/AGENTS.md))
6. Public components exported from `src/components/public.ts`
   (`flr-universal.ts` additionally, only when remote-capable)
7. Remote-capable (`@flr-generate`): generated code regenerated + committed, and
   a demo page in `apps/remote-dom-demo`. Add the Vue counterpart under
   `src/app/remote-vue/_demos` where you can — the React/Vue switch is only
   worth something while a pair describes the same page — but while the Vue
   binding is beta, a missing one does not block a change
8. Part of `flr-universal` (a composition the remote app renders itself):
   `pnpm nx test:parity remote-vue-components` passes. Bring the Vue rebuild
   (`packages/remote-vue-components/src/{components,overlays,list}`) along where
   you can; where you cannot, record the divergence in
   `packages/remote-vue-components/e2e/react-parity/knownGaps.ts` with its
   reason. That list covers the corpus only: `e2e/list-parity` has none, and
   each of its scenarios needs a tree per binding, so a `List` change brings the
   Vue `List` along. Behaviour that is not rendering belongs in
   `packages/components-base`, where every binding runs the same code
9. Visual changes: run the suite on demand with the `run-visual-tests` PR label
   (verify only); for intentional changes, update snapshots
   (`test:visual:update` or the `update-screenshots` PR label)

## Hard rules

- **Never hand-edit generated files** — regenerate and commit instead.
- **Base design tokens are taboo; visual design comes from UX** — compose
  existing tokens and patterns. Adding component tokens for a new component is
  fine (model them on existing components); when extending tokens, ask instead
  of inventing.
- **No breaking changes to `@flr-generate` component props** — deprecate with
  `useWarnDeprecation` instead. Check the status before calling a change
  breaking — the promise binds `stable` components only
  ([ADR 0005 §4–5](docs/adr/0005-semver-contract.md),
  [ADR 0003](docs/adr/0003-component-lifecycle-status.md)):
  - A `beta` component (`@flowStatus beta`, generated registry
    `packages/components/src/status/component-status.json`) may change its API
    in a non-major release.
  - Visual appearance, DOM structure, CSS class names and design-token names and
    values are never under it, whatever the status.
- **Use views (`@/views/*`) for internal composition** in `flr-universal`
  components.
- **Only remote-capable components in a `PropsContext`** (see the PropsContext
  section of [packages/components/AGENTS.md](packages/components/AGENTS.md)).

## Writing style (issues, ADRs, PR/commit bodies, code comments)

Applies to prose we author — issues, ADRs, PR and commit bodies, code comments.
Not to user-facing UI text (that lives in `locales/*` and follows product
voice).

Write **dense and simple**. Cut words, never content. Every fact stays —
constraints, edge cases, reasons, trade-offs, links. Brevity filters words, not
substance. Litmus test: if a sentence can be deleted without losing information,
delete it.

**Be dense:**

- **Lead with the point.** First sentence = the decision, problem, or ask. Don't
  restate the title or open with "In this issue we will…".
- **No filler.** Drop "it's worth noting", "basically", "in order to", hedging
  stacks ("might possibly perhaps").
- **No summary that just repeats the body.** Either the TL;DR replaces the
  detail or the detail replaces it — not both.
- **Cut marketing adjectives.** "robust", "seamless", "comprehensive",
  "powerful" carry no information. Delete them, or replace with the concrete
  fact.
- **Structure only when it earns its keep.** Three lines don't need three
  headings.

**Be simple:**

- **Short sentences, one idea each.** Break a clause chain into two or three
  sentences.
- **Simplify the glue, keep domain terms exact.** "in order to" → "to", but a
  symbol name, a token, or a version number stays precise.
- **Active voice, concrete subject.** "Flip the default and you change X" over
  "flipping the default results in a change to X".
- **Unpack lists.** Three options crammed into one sentence → three bullets.

When brevity and clarity conflict, **clarity wins** — a few more words to split
a dense sentence is a good trade.

## Common failures

Symptom → cause → fix for the footguns that cost the most time here. None of
these are repo bugs — they are the workflow biting back, and the fix is rarely
where the error points.

> **Agents:** hit a footgun that cost real time and isn't covered yet? Add the
> entry to the `AGENTS.md` of the package whose code or config the fix touches,
> plus one line in the [index](#package-specific-failures) below. Only a trap
> that any task can hit, in whatever package, gets its full entry here — this
> file is loaded into every session. Keep the bar high: only a **verified,
> recurring workflow trap** with its real error signature, and **reproducible +
> non-obvious**. A genuine repo bug does not belong here — fix it.

- **Symptom:** CI step **"Check all generated code is committed"** fails
  (`git diff --exit-code`)

  **Cause:** You changed an `@flr-generate` component's props, an icon, prop
  JSDoc, or a `.module.scss`'s class names and didn't regenerate — or
  regenerated but didn't commit

  **Fix:** `pnpm build` (or the specific generator from the
  [Generated code](#generated-code--must-be-committed) table), then commit the
  changed `view.ts`, `src/views/*`, `src/auto-generated/**`,
  `*.module.d.scss.ts`, icon, or `doc-properties.json`

- **Symptom:** A package script errors (e.g. **"X is not exported from
  `@mittwald/flow-…`"**, missing module) or silently uses **stale** output from
  another package

  **Cause:** You ran the package script directly
  (`pnpm --filter <pkg> <script>`, `next dev`, bare `vite`), which builds only
  that package and skips the `^build` chain that (re)builds and regenerates its
  workspace dependencies (incl. `view.ts` / `src/auto-generated/**`)

  **Fix:** **Default to the nx target** — `pnpm nx <target> <pkg>` (e.g.
  `pnpm nx dev <app>`, `pnpm nx build <pkg>`); its `dependsOn: ["^build", …]`
  builds and regenerates every dependency first. Reach for a direct
  single-package script only when the dependencies are already current

- **Symptom:** An `nx` graph target dies with **"configured to use 11.19.0 of
  pnpm … your current pnpm is v…"**

  **Cause:** You prefixed a dependency-graph target with `corepack`; nested
  per-task pnpm spawns resolve to a pnpm other than the pinned `11.19.0`

  **Fix:** Use **bare `pnpm nx …`** for graph targets (`build`, `dev`, anything
  with `dependsOn`/`^build`). `corepack pnpm --filter <pkg> <script>` stays fine
  for single-package scripts. The version in the message is whatever
  `packageManager` pins, so read it there rather than from this entry

- **Symptom:** A new dependency **won't resolve** on `pnpm install`

  **Cause:** `minimumReleaseAge` blocks versions younger than one week
  (`@mittwald/*` exempt)

  **Fix:** Use an older published version, or wait out the window

- **Symptom:** Dev server 500s with **"Can't resolve '&lt;pkg&gt;'"** after
  merging `main` into a worktree

  **Cause:** `pnpm install` ran before the merge pulled in a new dependency

  **Fix:** Re-run `pnpm install`; a running dev server picks the dep up on the
  next request

- **Symptom:** `test:compile` passes locally, but CI's `unit` job fails with a
  TS error in a **different package** than the one you ran it for — e.g.
  **`TS2339: Property 'value' does not exist on type 'HTMLElement | SVGElement'`**
  on `Locator.element()`

  **Cause:** A per-package nx target typechecks that package only, so a diff
  that adds or edits files in a second package leaves that package's
  `test:compile` unrun. Its **browser tests passing proves nothing about types**
  — vitest transpiles without typechecking, so the one gate that reads types
  there is exactly the one a per-package run skips

  **Fix:** Run it for **every** package the diff touches (`git status --short`
  names them), or use `pnpm nx run-many -t test:compile` / `pnpm test`, which is
  what CI does

- **Symptom:** A `.scss` file you never opened appears in your diff, reformatted

  **Cause:** You ran `prettier --write` over a **directory**. The repo's
  `format`/`format:check` globs list `css` but not `scss`, so SCSS is
  deliberately unformatted — and `pnpm lint` therefore cannot tell you that you
  just reformatted one

  **Fix:** Pass the files you changed, not a directory. Check `git status` after
  any `--write` and revert what you did not mean to touch; nothing downstream
  will flag it

- **Symptom:** A cached nx task serves output built with a **different** value
  of an environment variable — a job's artifact contradicts the env it was
  given, with nothing failing

  **Cause:** nx folds an environment variable into a task's hash only when it is
  declared as an `{ "env": … }` input, and CI restores the cache written on
  `main` into every PR. A variable that actually varies then makes a cache hit
  both legitimate and wrong — in either direction. `apps/docs`'
  `NEXT_PUBLIC_SITE_URL` decides whether `robots.txt` says `Allow` or
  `Disallow`, so an undeclared one could have put a preview's `Disallow: /` on
  flow.mittwald.de

  **Fix:** Declare it in the target's `inputs` (see the `build` target in
  `apps/docs/project.json`). Prove it: run the task twice with the same value —
  the second must log
  `nx run <project>:<target> [existing outputs match the cache]` — then once
  with a different value, which must rebuild for real (#3128)

- **Symptom:** The **Routing** check fails on a `fix:` PR with
  **`Commit <sha> is a 'feat' (…) — a merge commit brings it onto 'main'`**, or
  on a `feat:` PR into `next` with **`Commit <sha> marks a breaking change`** —
  although the PR title is valid

  **Cause:** The check reads every commit of the PR, not just the title. `main`
  allows merge commits and `next` allows only those, and a merge commit brings
  each branch commit onto the line. #3290 carried a `feat` commit under a `fix:`
  title and released `main` as 1.3.0 (#3333); #3166 carried a `!` commit and
  opened `2.0.0-next.0` (#3199). The check counts `feature` as `feat` and
  matches breaking markers the way lerna's parser does (`Fix!:`, `fix()!:`,
  `* BREAKING CHANGE:`)

  **Fix:** Reword the commit (`git rebase -i`, then force-push your branch),
  squash the branch locally into one commit, or move the feature to `next`. A PR
  with more than 250 commits fails too — GitHub lists no more, so split it

### Package-specific failures

Match your error against this index; the full entry lives in the linked file.

**Visual and cross-version tests** —
[remote-react-components/AGENTS.md](packages/remote-react-components/AGENTS.md#common-failures):

- A visual test stays red in CI after regenerating screenshots on macOS
- A **small** visual diff (`N pixels (ratio 0.01) differ`) — open the diff
  before reaching for `update-screenshots`
- Scheduled cross-version tests go red _after_ your PR merged
- A hover before `testScreenshot` captures the non-hovered state
- One environment (`Local` / `Remote`) fails, and `update-screenshots` reports
  "No Screenshot Updates Required"
- A baseline of a component you never touched changes in your PR
- After the `update-screenshots` commit, `main`, `visual`, `unit` and `browser`
  are missing from the checks (`action_required`)

**Component authoring** —
[components/AGENTS.md](packages/components/AGENTS.md#common-failures):

- `test:compile`: the `flowComponent("X", …)` name/props type isn't assignable
- `test:compile`: `Property 'children' does not exist on type 'Partial<XProps>'`
- `DataCloneError: Symbol(react.transitional.element) could not be cloned`, or
  `Remote rendering failed: Timeout reached`
- A function prop renders `[object Promise]` or is always truthy remotely
- A `components` browser test keeps passing after a change to `packages/icons`
- `flow/no-unknown-global-flow-class` / `flow/no-unknown-flow-class`

**Build and test tooling** —
[core/AGENTS.md](packages/core/AGENTS.md#common-failures):

- Firefox dies at startup on macOS 27
  (`Failed to connect to the browser session`, `Could not find profile folder.`)
- `Your Vite config uses features that are unsupported by configLoader: 'native'`
- A PostCSS plugin behaves differently in the release build
- A new browser vitest project never runs, and the suite reports success
- `error TS…` in the release build's log while `test:compile` is green
- `Published declarations of <pkg>: … imports "<dep>", which <pkg> does not declare`

**Release** —
[docs/release-workflow.md](docs/release-workflow.md#common-failures):

- `lint` fails at "Check version consistency" after merging the base branch

## Where to look next

| Topic                                         | Read                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Component patterns, styling, testing, i18n    | [packages/components/AGENTS.md](packages/components/AGENTS.md)                          |
| Remote connection & serialization             | [packages/remote-core/AGENTS.md](packages/remote-core/AGENTS.md)                        |
| Remote elements / React API / host renderer   | `packages/remote-{elements,react-components,react-renderer}/AGENTS.md`                  |
| Vue API for remote apps                       | [packages/remote-vue-components/AGENTS.md](packages/remote-vue-components/AGENTS.md)    |
| Remote-UI concepts & component implications   | [docs/remote-ui.md](docs/remote-ui.md)                                                  |
| Supporting a non-React remote framework       | [docs/remote-framework-bindings.md](docs/remote-framework-bindings.md)                  |
| Logic shared by the React and Vue bindings    | [packages/components-base/AGENTS.md](packages/components-base/AGENTS.md)                |
| Icon pipeline                                 | [packages/icons-base/AGENTS.md](packages/icons-base/AGENTS.md)                          |
| Design tokens                                 | [packages/design-tokens/AGENTS.md](packages/design-tokens/AGENTS.md)                    |
| Styleguide content authoring                  | [apps/docs/AGENTS.md](apps/docs/AGENTS.md) → [apps/docs/README.md](apps/docs/README.md) |
| Remote demo app                               | [apps/remote-dom-demo/AGENTS.md](apps/remote-dom-demo/AGENTS.md)                        |
| Vite/Vitest configs, release build, nx wiring | [packages/core/AGENTS.md](packages/core/AGENTS.md)                                      |
