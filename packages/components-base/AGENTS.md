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
  stays with the binding and only reports its outcome here. Same cut in
  `ListSearch`: the term, its initial value and its persistence are shared, how
  the field renders is not. `ListSorting` needed no cut at all — it only
  translates between the table and the settings store.
- **`ListModelContext` replaced the `List` back-reference.** The model classes
  used to carry a whole `List`, which is a React object — its constructor calls
  hooks. What they need is the TanStack table and the persistence, so that is
  all the context has, and a binding's list satisfies it with three getters. It
  is called `dataTable`, not `table`, because Flow's `List` already has a
  `table` — its own view model — and a getter of that name collides.
- **What a value renders to is a type parameter, not a decision.** `ListFilter`
  has to show its values, and "shown" is the binding's — so it carries
  `TRendered` (default `unknown`) and React's `Filter` fills it with
  `ReactNode`. That is the cheaper half of the alternative, which was to keep
  `FilterValue` in React and have the core construct it through a factory hook.
- **Beware `Table<never>` where `Table<any>` is expected.** A list of concrete
  filters is not assignable to `ListFilter<any, …>[]`: a row model sits in a
  contravariant position deep inside `Column`, so `never` and `any` do not meet.
  `storeFilters` takes the two members it reads instead of the class.
- **`ListTable` is `useReactTable` in MobX.** That hook is `createTable`, a
  `useState` for the table's own state, and a `setOptions` on every render that
  folds the state back into the options — and `@tanstack/vue-table` reimplements
  the same twenty lines against Vue. So the state lives here and each binding
  brings a subscription. Options still arrive from the binding per render,
  because that is where they come from: the loaded data, the column definitions
  the filters and sortings produce. `setState` re-applies them, or a state
  change would never reach the table.
- **The view mode is a MobX observable, not the binding's state.** React used
  `useState` inside the model, which meant the model was rebuilt every render
  and the state survived only because the hook did. Shared, it holds the value
  itself — so the binding both subscribes _and_ keeps the instance:
  `ListViewMode.useNew` is `useStatic` plus one `useSelector`. Drop that
  `useSelector` and the list still switches mode while every component that does
  not own the model keeps rendering the old one, which is what the `View mode`
  browser test asserts.
- **A type both packages need is re-exported, never declared twice.** Two copies
  of `PropertyName<T>` typechecked apart and failed where they met:
  `DeepKeys<T>` is a conditional type, and TypeScript compares two conditionals
  only when they come from the same declaration. Worse, `tsc --noEmit` stayed
  green and only the declaration rollup in `packages/components`' release build
  reported it — without failing. `packages/components` re-exports these from
  here.
- **The batches controller does not subscribe to anything.** A filter or a
  search that changes has to put the list back on its first batch, but the
  filters are the list's, and handing a list of concrete filters to a shared
  model is the `Table<never>` trap below. So the controller only exposes
  `reset()` and the binding's `List` wires it.
- **The settings port is spelled out per key.** One generic method whose return
  type indexes a value map reads better and does not typecheck: against a real
  store TypeScript resolves the return to the _intersection_ of every value, and
  nothing satisfies `ListSortingSetting & ListSearchSetting`.
- **Imported as source, bundled by the consumer.** There is no build step —
  `main` is `src/index.ts`, like `@mittwald/flow-core`. The package is private
  and never reaches npm, so both consumers **inline** it: on the Vue side by
  being a devDependency (`externalizeDeps` leaves those alone), on the React
  side additionally through the plugin's `except` list. A move to `dependencies`
  would externalize it and publish a bare import of a package that does not
  exist. Its own **runtime** deps (`mobx`, `remeda`) must therefore be real
  dependencies of **both** consumers, `@tanstack/table-core` included: since
  `ListTable` calls `createTable`, leaving it out of `packages/components` put a
  96 kB second copy of it inside that package's bundle, beside the one
  `@tanstack/react-table` already brings.
- **Relative imports only.** No `@/` alias: the source is compiled by two
  different builds, and an alias would have to be resolvable in both.
