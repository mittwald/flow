---
since: 1.1.47
title: "Popover: `defaultOpen` renamed, `isOpen` and `onOpenChange` now work"
kind: migration
action: codemod
remotePackage: true
apply: >-
  Rename `defaultOpen` to `isDefaultOpen` on `Popover`, `ContextualHelp` and
  `ContextMenu` — a codemod does it, scoped to those three. Leave `defaultOpen`
  alone on `Select`, `MenuTrigger`, `Tooltip`, `TooltipTrigger`,
  `DialogTrigger`, `DatePicker` and `DateRangePicker`, where it is react-aria's
  own prop and unchanged. Then check every `isOpen` and `onOpenChange` passed to
  those three by hand, because both changed behaviour and neither is
  mechanically decidable. `isOpen` used to be ignored and now controls the
  popover: a value that is not kept up to date through `onOpenChange` keeps the
  popover closed. `onOpenChange` used to take over the open state and now only
  reports it, so a handler that performed the close itself —
  `onOpenChange={(open) => controller.setOpen(open)}` — can drop that call, and
  a handler that relied on the prop to *suppress* the close no longer does; use
  the controller's `onClose` for that.
---

`Popover`'s open state props now behave the way their names say. This covers
`ContextualHelp` and `ContextMenu` too, which inherit them.

#### `defaultOpen` is now `isDefaultOpen`

The name matches `Modal` and the other overlays.

```diff
- <ContextualHelp defaultOpen>
+ <ContextualHelp isDefaultOpen>
```

`defaultOpen` keeps working and logs a deprecation warning. A codemod renames
it, on `Popover`, `ContextualHelp` and `ContextMenu` only — the identically
named react-aria prop on `Select`, `MenuTrigger`, `Tooltip`, `TooltipTrigger`,
`DialogTrigger`, `DatePicker` and `DateRangePicker` is untouched.

#### `onOpenChange` reports instead of taking over

Passing `onOpenChange` used to switch the popover into a controlled mode that
had no `isOpen` to control it with: the handler fired, and the popover stopped
closing. It is now a notification that fires on every path — react-aria's
dismissal, and a close performed through the controller — and never performs or
suppresses the change.

```diff
- <Popover onOpenChange={(isOpen) => controller.setOpen(isOpen)}>
+ <Popover onOpenChange={(isOpen) => track(isOpen)}>
```

Two things to check:

- A handler that performed the close itself can drop that call. Leaving it in is
  harmless — the controller ignores a state it is already applying.
- A handler that relied on the prop to _block_ a close no longer blocks it. Use
  the controller for that: a handler registered through `useOverlayController`'s
  `onClose` still aborts by returning `false`.

#### `isOpen` controls the popover

`isOpen` was inherited from react-aria but silently overridden. It is now the
open state whenever it is set.

```tsx
const [isOpen, setIsOpen] = useState(false);

<Popover isOpen={isOpen} onOpenChange={setIsOpen}>
  …
</Popover>;
```

If you pass `isOpen` without updating it from `onOpenChange` — for instance by
spreading props that happen to carry it — the popover no longer opens. Drop the
prop, or wire up the state.

A controller stays the third option and needs neither prop: with
`controller={controller}`, `onOpenChange` is a pure monitor.
