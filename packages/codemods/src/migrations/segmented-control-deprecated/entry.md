---
since: 0.2.0-alpha.1056
title: SegmentedControl deprecated
kind: deprecation
action: manual
remotePackage: true
apply: >-
  Replace `SegmentedControl` with `Tabs` when the selection switches displayed
  content, or with `RadioGroup` when it sets a value. Pick per usage — and where
  the usage does both, one rule decides it: if the switched branches contain
  form fields, take `RadioGroup`. `Tabs` keeps every panel mounted, so branches
  that were alternatives become siblings, and two branches registering the same
  field name collide. The two directions cost very different amounts of work.
  Towards `RadioGroup` it is a prop-compatible rename: `SegmentedControl` →
  `RadioGroup` and `Segment` → `RadioButton` (always `RadioButton`, not `Radio`;
  it takes exactly `Segment`'s props), with `value`/`defaultValue`/`onChange`
  and a `Label` child all carrying over. Only `containerBreakpointSize` has no
  counterpart, and the joined row is not reproduced. Towards `Tabs` it is
  structural: the state props are `selectedKey`/`defaultSelectedKey` rather than
  `value`/`defaultValue`, there is no `Label` slot (the group label moves to the
  surrounding `Heading`, or to `aria-label` on `Tabs` when it should not be
  visible, or goes away), and the switched panels move inside the tabs — where
  they stay mounted, so form fields in them keep their registration.
---

`SegmentedControl` and `Segment` are deprecated. The component covered two
different jobs, and each already has its own component in Flow. Which
replacement is right depends on what the control does at that place.

**Switching content.** The selection swaps what is shown below it — a content
switcher. That is what `Tabs` are for: each `Segment` becomes a `Tab` with its
title in `TabTitle` and its content inside the tab. The label and the state that
tracked the selection both go away.

```diff
- <SegmentedControl defaultValue="app">
-   <Label>Verbindung</Label>
-   <Segment value="app">Mit App verbinden</Segment>
-   <Segment value="container">Mit Container verbinden</Segment>
- </SegmentedControl>
- {connection === "app" ? <AppSettings /> : <ContainerSettings />}
+ <Tabs>
+   <Tab>
+     <TabTitle>Mit App verbinden</TabTitle>
+     <AppSettings />
+   </Tab>
+   <Tab>
+     <TabTitle>Mit Container verbinden</TabTitle>
+     <ContainerSettings />
+   </Tab>
+ </Tabs>
```

**Setting a value.** The selection feeds a form or a setting. Use a
`RadioGroup`: each `Segment` becomes a `RadioButton`, everything else — `Label`,
`FieldDescription`, `FieldError`, `value`/`defaultValue`/`onChange`, the React
Hook Form binding — stays as it is.

This direction is a rename, not a restructure. The types line up:
`SegmentedControlProps` and `RadioGroupProps` both extend
`Omit<Aria.RadioGroupProps, "children">`, and `SegmentProps` and
`RadioButtonProps` are the same type (`RadioButtonProps` is declared as
`RadioProps`, which is identical to `SegmentProps`). Only
`containerBreakpointSize` has no counterpart — see the note at the end.

```diff
- <SegmentedControl defaultValue="debit">
+ <RadioGroup defaultValue="debit">
    <Label>Zahlungsart</Label>
-   <Segment value="debit">Lastschrift</Segment>
-   <Segment value="invoice">Rechnung</Segment>
+   <RadioButton value="debit">Lastschrift</RadioButton>
+   <RadioButton value="invoice">Rechnung</RadioButton>
    <FieldDescription>Jederzeit änderbar</FieldDescription>
- </SegmentedControl>
+ </RadioGroup>
```

**Always `RadioButton`, not `Radio`.** A `RadioGroup` also accepts a plain
`Radio`, and it takes the same props, so both would compile — but `RadioButton`
is the replacement for a `Segment`. The appearance still changes: `RadioButton`
does not reproduce the segmented control's joined row, which came from
`Segment`'s own `flex: 1` and collapsed borders. See the
[RadioGroup docs](https://flow.mittwald.de/components/form-controls/radio-group).

#### Three things the Tabs direction changes

**The controlled-state props are named differently.** `SegmentedControl` takes
`value` / `defaultValue` / `onChange` (it is a radio group); `Tabs` takes
`selectedKey` / `defaultSelectedKey` / `onSelectionChange`. Nothing carries over
by name here, unlike the `RadioGroup` direction.

**The group `Label`.** `SegmentedControl` is a form field — it wraps
react-aria's `RadioGroup` — so a `<Label>` inside it is a field label. `Tabs`
has no equivalent slot, and a tab list labels itself through its tab titles. The
`Label` therefore cannot move into `Tabs`, but its text has somewhere to go:

- into the surrounding `Section`'s `Heading`, when the group wants a visible
  title
- into `aria-label` on `Tabs`, when it does not — that names the tab list for
  screen readers without showing the name
- nowhere, when the surrounding heading already names the group

A `Label` on its own is **not** a signal that the usage was a `RadioGroup` case
— plenty of content switchers were authored with one, because the component
required a field label.

**Panels that register form fields.** Moving the switched-in content into a
`Tab` does not change when it mounts. `Tab` renders its panel with
`shouldForceMount` and wraps `Content` and `Section` in
`<Activity isActive={…}>`, so every tab's subtree is mounted and keeps its state
— an inactive tab is hidden, not unmounted. React Hook Form fields inside a tab
stay registered across a tab switch, exactly as they did as siblings below a
`SegmentedControl`.

#### When a usage is both at once

A selection that sets a mode value **and** swaps which input is rendered below
it fits both descriptions. Take `RadioGroup`.

```tsx
<SegmentedControl value={mode} onChange={setMode}>
  <Segment value="a">…</Segment>
  <Segment value="b">…</Segment>
</SegmentedControl>
{mode === "a" && <Field name="x"><Select … /></Field>}
{mode === "b" && <Field name="x"><TextField … /></Field>}
```

The `Tabs` example above has the same shape — a switcher followed by a
conditional — but the branches there hold no form fields. Here they do, and
"panels stay mounted" stops being a convenience: as siblings below the control
exactly one branch was mounted at a time, so exactly one input was registered.
Inside `Tabs` both are mounted, both register, and on one field name they
collide. `RadioGroup` leaves the conditional where it is, so the mounting does
not change at all.

There is no codemod, and the reason is the choice rather than the edit. Which
replacement is right cannot be decided from the source: a value-setting usage
and a content switcher look alike at the call site, and only the surrounding
intention separates them. The form-field rule above is the one part that is
decidable, and it decides the overlap rather than the whole question. The
`RadioGroup` direction would be mechanical **once that decision is made** — if
you have many usages that all go that way, a find-and-replace of
`SegmentedControl`/`Segment` gets you most of it.

`SegmentedControl` and `Segment` (and the `flr-segmented-control` /
`flr-segment` remote elements) keep working unchanged and will be removed in a
future major version. `SegmentedControl` logs a deprecation warning at runtime;
`Segment` relies on it, since it only renders inside a `SegmentedControl`.

The `containerBreakpointSize` property has no counterpart: `Tabs` collapse on
their own when the available width runs out, and a `RadioGroup` stacks its
options anyway.
