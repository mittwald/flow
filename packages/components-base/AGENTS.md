# @mittwald/flow-components-base — Agent Guide

Private package. The half of a component's logic that has no framework in it, so
`packages/components` (React) and `packages/remote-vue-components` (Vue) run one
implementation instead of two. See the [root AGENTS.md](../../AGENTS.md) and
[docs/remote-framework-bindings.md](../../docs/remote-framework-bindings.md).

- **Nothing framework-specific may enter.** No `react`, no `vue`, no import from
  a package that pulls one in — `@mittwald/react-use-promise`'s
  `AsyncResourceState` is spelled out here rather than imported for exactly that
  reason. The rule has a test rather than a lint rule:
  `remote-vue-components/src/lib/mobxSelector.test.ts` drives this package's
  state through Vue's reactivity, and a React import breaks it.
- **MobX is the reactivity.** It is framework-agnostic and already the substrate
  in `packages/components` (`SettingsProvider`, `react-tunnel`), so a binding
  only has to bring a subscription: `useSelector` on the React side,
  `watchMobxValue` on the Vue side. Both are ~15 lines against a shared model —
  that ratio is the point of this package.
- **State belongs here, the work that produces it does not.** `ListLoaderState`
  holds the batches, the deduplication and the "still loading" rules; _fetching_
  a batch is `usePromise`/Suspense in React and something else in Vue, so it
  stays with the binding and only reports its outcome here.
- **Imported as source, bundled by the consumer.** There is no build step —
  `main` is `src/index.ts`, like `@mittwald/flow-core`. The package is private
  and never reaches npm, so both consumers **inline** it: on the Vue side by
  being a devDependency (`externalizeDeps` leaves those alone), on the React
  side additionally through the plugin's `except` list. A move to `dependencies`
  would externalize it and publish a bare import of a package that does not
  exist. Its own runtime deps (`mobx`, `remeda`) must therefore be real
  dependencies of **both** consumers.
- **Relative imports only.** No `@/` alias: the source is compiled by two
  different builds, and an alias would have to be resolvable in both.
