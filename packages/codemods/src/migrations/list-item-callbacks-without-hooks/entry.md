---
since: 1.6.0
title: "ListItem: `href` and `textValue` must not call hooks"
kind: migration
action: manual
remotePackage: true
apply:
  "Find `ListItem` elements — including the `Item` of a `typedList()` — whose
  `href`, `textValue` or `defaultExpanded` callback calls a hook: a `use…()`
  function, `React.use()`, or a hook-like method such as a ghost's `.use()`.
  Call the hook once in the component that renders the list, store the result in
  a variable, and read that variable inside the callback. Where the value
  depends on the item, have the hook return a function (e.g. a tester or a URL
  builder) and call that function with the item. Hooks in the item's render
  function (its children) are fine and stay."
---

Since 1.6.0 a list skips rendering items that have not changed. To decide that,
it calls `href` and `textValue` for every item on each render of the list —
outside the item's own render and as often as it needs. Hooks inside these
callbacks used to run inside the item and happened to work; now they run in
another component a varying number of times, and React fails with
`Rendered more hooks than during the previous render`
([React error 310](https://react.dev/errors/310)) as soon as the list
re-renders.

```diff
+ const projectId = projectGhost.id.use();
+
  <List.Item
-   href={(c) => buildHref(projectGhost.id.use(), c.id)}
+   href={(c) => buildHref(projectId, c.id)}
  >
```

For a value that depends on the item, call the hook once and let it return a
function:

```diff
+ const isNew = useNewEntriesTester();
+
  <List.Item
-   defaultExpanded={(entry) => entry.useIsNew()}
+   defaultExpanded={(entry) => isNew(entry)}
  >
```

`defaultExpanded` is still called inside the item, but it is read on mount only
— keep it free of hooks as well. The item's render function (its children) is
unaffected: it renders inside the item and may call hooks.

ESLint's `react-hooks/rules-of-hooks` does not catch most of these cases: it
does not treat a method call such as `ghost.id.use()` or `entry.useIsNew()` as a
hook.
