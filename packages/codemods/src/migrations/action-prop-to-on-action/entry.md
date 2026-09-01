---
since: 0.2.0-alpha.646
title: "Action: `action` renamed to `onAction`"
kind: migration
action: codemod
remotePackage: true
apply: >-
  Rename the `action` prop on `Action` to `onAction`. Not only a rename: the new
  prop is typed `ActionFn` (`(...args: unknown[]) => unknown`), so a function
  *reference* that declares a parameter no longer type-checks and needs wrapping
  — `onAction={() => controller.close()}` rather than
  `onAction={controller.close}`. Check every site where you passed a reference
  rather than an inline arrow; the codemod renames the prop but cannot decide
  this one from the source.
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

#### The type changed too

`onAction` is typed `ActionFn`, which is `(...args: unknown[]) => unknown`. A
function that declares a parameter of any narrower type is not assignable to it,
because the parameter would receive `unknown`:

```
Type '(options?: CloseOptions | undefined) => void' is not assignable to type 'ActionFn'.
  Types of parameters 'options' and 'args' are incompatible.
    Type 'unknown' is not assignable to type 'CloseOptions | undefined'.
```

Wrap the call instead of passing the reference:

```diff
- <Action onAction={controller.close}>
+ <Action onAction={() => controller.close()}>
```

Only function **references** are affected. An inline arrow
(`onAction={() => …}`), a zero-parameter function, and anything already
accepting `unknown` are all fine.

A codemod renames the prop. It deliberately does not wrap: whether the
referenced function declares a parameter cannot be decided from the source —
that needs type information — and wrapping everything would silently drop the
arguments `Action` passes to handlers that do accept them.
