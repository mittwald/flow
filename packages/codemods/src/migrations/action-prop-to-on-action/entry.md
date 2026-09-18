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
  `onAction={controller.close}`. A codemod does both. It wraps every bare
  reference (`close`, `controller.close`), because the wrap is a no-op for a
  reference that did not need it. It leaves a value that already is the handler
  or produces one — an arrow function, a function expression, a call like
  `makeHandler()` or `close.bind(controller)` — and anything that is not one
  reference, such as `isOpen ? close : open` or `controller?.close`. Two wraps
  to look at afterwards: a handler that read the event `Action` forwards stops
  receiving it, and a possibly-undefined reference (`onAction={props.onAction}`)
  becomes a call TypeScript rejects — add the guard it asks for.
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

A codemod renames the prop and wraps the reference.

Whether a reference _needs_ wrapping is not decidable from the source — that
needs type information. Performing the wrap does not need it: `() => fn()` calls
what `Action` would have called, and `onAction` takes no arguments. So the wrap
fixes the reference that needed it and changes nothing for the rest, which makes
the decision unnecessary.

Wrapped: a plain identifier and a member expression (`close`,
`controller.close`, `this.handleSave`). Left alone: an arrow function and a
function expression, which already are the handler; a call (`makeHandler()`,
`close.bind(controller)`), which produces it; and anything that is not one
reference (`isOpen ? close : open`, `onClose ?? noop`, `controller?.close`).

Two wraps are worth a look afterwards. A handler that read the event `Action`
forwards — undocumented, but it does forward the trigger's event — stops
receiving it. And `onAction={props.onAction}`, where the reference may be
`undefined`: passing it was fine, calling it is not, so TypeScript now reports
the call and wants a guard.
