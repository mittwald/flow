# Contribute

The package's own tooling in depth. Start with the [agent guide](./AGENTS.md).

## Parity harnesses

`pnpm nx test:parity remote-vue-components` runs both. For what a parity harness
has to do for any binding, see
[docs/remote-framework-bindings.md](../../docs/remote-framework-bindings.md#checklist-for-a-new-binding-package).

- **The React package's visual corpus is the parity gate** (`e2e/react-parity`,
  `pnpm nx test:parity remote-vue-components`). It renders the whole corpus
  twice — once from `remote-react-components`, once from here — and asserts the
  host builds the same DOM. The corpus is reused **unmodified**: the harness
  aliases `@/tests/lib/environments` to its own environment, the way the
  cross-version harness does. Every scenario is compared except those listed in
  `knownGaps.ts` with a reason — `List.browser.test.tsx` as a whole file (every
  scenario in it needs Flow's `List`), the others by name.
  - **A stale known gap fails the run.** A full run has the React pass write
    vitest's JSON report, and every `knownGaps.ts` entry has to name a corpus
    file or scenario in it (`dev/react-parity/staleKnownGaps.ts`); a
    `divergingScenarios` entry whose scenario matches again fails as well. An
    `unsupportedScenarios` entry claims the converter refuses the scenario, so a
    full run converts exactly those once more and fails on one that no longer
    throws `UnsupportedScenarioError`.
  - **Both passes run the files in one order.** A scenario sees what earlier
    files left in the document, so the order is part of the comparison.
    CodeMirror's `cm-nonmatchingBracket` counts as pending: a truncated
    CodeBlock's parse had not reached the closing brace in one pass under load.
  - `test:parity:dev` writes the React references before it watches the Vue
    pass, so a missing reference fails instead of being written from Vue, and
    leaves out what a full run leaves out.
  - **A password is masked only once one was generated.** The generate button
    produces a value neither pass can predict; a value the scenario typed is
    content and stays compared.
  - `src/tests` is type-checked by `tsconfig.vite.json`, whose `rootDir` is the
    repository root — it imports the React package's test tooling by relative
    path.
  - A scenario's React element tree is rebuilt as Vue vnodes by `reactToVue.ts`:
    `type` → export name → Vue component, element-valued props → slots. A
    scenario that defines a React component of its own cannot be converted, and
    says so.
  - **Nothing is committed.** The references are written from React on every
    run, so they cannot drift into a second source of truth.
  - **Stable is not settled.** Each pass reads the host's DOM until it stops
    changing — but the output also stops changing _while_ the host waits on an
    async job of its own, and the two passes then each get their own coin flip.
    `PasswordCreationField` validates its empty value on mount and holds
    `complexity-indicator--loading` until that resolves, which outlasts the
    sampling window on a loaded runner and fails the run on a class no remote
    tree decides. A chart is the other shape of this: recharts wraps an area in
    an `animationClipPath` layer on the first render that has points and drops
    it on the next, so one pass read whole `<g>` layers the other never had.
    `pendingMarkers` in `environments.ts` waits both out; add to it rather than
    normalizing the class away in `hostHtml.ts`, so a marker that never clears
    still reaches the comparison.
  - `knownGaps.divergingScenarios` entries are **self-cleaning**: one that
    starts matching fails the run, naming the entry to delete.
- **The `List` has a parity harness of its own** (`e2e/list-parity`), because
  the corpus cannot express it. It is written against a list of **bindings**
  rather than against React and Vue: `harness/bindings/*` each mount a remote
  app, the first is the reference, and every other is compared against it — so a
  third framework is a new file and one key per scenario, not a new harness. Two
  things it does that the corpus harness does not:
  - **It asserts coverage.** A list of class names has to appear somewhere in
    what was compared. Comparisons that all pass say nothing about a component
    that stopped being rendered.
  - **Both sides are hand-written**, so a scenario can use each binding's own
    authoring style — `typedList<T>()` on the React side, slots on the Vue side.

  What both harnesses share is how they read (`hostOutput`, `hostHtml`): the
  root container plus whatever the host portalled to `document.body` — a menu, a
  modal — minus the per-document singletons. react-aria keeps one live announcer
  for the whole document, filled when something is announced and emptied on a
  timer, so a search in one scenario was still announcing "0 matches" while the
  next was read; it is left out by its `data-live-announcer` attribute. Both
  also settle before they park the pointer, for the reason `testScreenshot`
  gives. And a scenario that waits on something asynchronous of its own — the
  search's submit delay — waits for its result in `interact`, because the output
  stops changing while it waits and reads as stable.
