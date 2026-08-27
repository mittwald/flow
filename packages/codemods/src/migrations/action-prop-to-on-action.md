---
since: 0.2.0-alpha.646
title: "Action: `action` renamed to `onAction`"
kind: migration
action: codemod
remotePackage: true
detect: rg -t ts '<Action\b[^>]* action=\{'
apply: Rename the `action` prop on `Action` to `onAction`.
verify: tsc --noEmit passes, and `rg '<Action\b[^>]* action=\{'` finds nothing.
---

`Action`'s `action` prop is now called `onAction`, which matches the naming of
every other event prop in Flow.

```diff
- <Action action={createOrganization}>
+ <Action onAction={createOrganization}>
    <Button>Organisation anlegen</Button>
  </Action>
```

`action` was removed from `ActionProps`, so TypeScript reports it as an unknown
prop. At runtime the old prop still works: `Action` maps it to `onAction` and
logs a deprecation warning, and an explicit `onAction` wins. The fallback will
be removed in a future major version.

A codemod renames the prop on `Action`.
