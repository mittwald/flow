---
since: 0.2.0-alpha.1056
title: SegmentedControl deprecated
kind: deprecation
action: manual
remotePackage: true
apply: >-
  Replace `SegmentedControl` with `Tabs` when the selection switches displayed
  content, or with `RadioGroup` when it sets a value. Pick per usage. The two
  directions cost very different amounts of work. Towards `RadioGroup` it is a
  prop-compatible rename: `SegmentedControl` → `RadioGroup`, `Segment` → `Radio`
  or `RadioButton` (identical props to `Segment`; `RadioButton` is the boxed
  one, though neither reproduces the joined row), and
  `value`/`defaultValue`/`onChange` and a `Label` child all carry over. Only
  `containerBreakpointSize` has no counterpart. Towards `Tabs` it is structural:
  the state props are `selectedKey`/`defaultSelectedKey` rather than
  `value`/`defaultValue`, there is no `Label` slot (the group label moves to the
  surrounding `Heading` or goes away), and the switched panels move inside the
  tabs — where they stay mounted, so form fields in them keep their
  registration.
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
`RadioGroup`: each `Segment` becomes a `Radio` or a `RadioButton`, everything
else — `Label`, `FieldDescription`, `FieldError`, `value`/`defaultValue`/
`onChange`, the React Hook Form binding — stays as it is.

This direction is a rename, not a restructure. The types line up:
`SegmentedControlProps` and `RadioGroupProps` both extend
`Omit<Aria.RadioGroupProps, "children">`, and `SegmentProps` and `RadioProps`
are the same type (`RadioButtonProps` is declared as `RadioProps`). Only
`containerBreakpointSize` has no counterpart — see the note at the end.

```diff
- <SegmentedControl defaultValue="debit">
+ <RadioGroup defaultValue="debit">
    <Label>Zahlungsart</Label>
-   <Segment value="debit">Lastschrift</Segment>
-   <Segment value="invoice">Rechnung</Segment>
+   <Radio value="debit">Lastschrift</Radio>
+   <Radio value="invoice">Rechnung</Radio>
    <FieldDescription>Jederzeit änderbar</FieldDescription>
- </SegmentedControl>
+ </RadioGroup>
```

`Radio` or `RadioButton`? They take the same props, so either is a drop-in for
`Segment`, and the choice is purely how it renders: `Radio` is the plain control
with a label, `RadioButton` a bordered box. Neither reproduces the segmented
control's joined row — that came from `Segment`'s own `flex: 1` and collapsed
borders — so the appearance changes either way. Pick from the
[RadioGroup docs](https://flow.mittwald.de/04-components/form-controls/radio-group)
rather than assuming one preserves the old look.

#### Three things the Tabs direction changes

**The controlled-state props are named differently.** `SegmentedControl` takes
`value` / `defaultValue` / `onChange` (it is a radio group); `Tabs` takes
`selectedKey` / `defaultSelectedKey` / `onSelectionChange`. Nothing carries over
by name here, unlike the `RadioGroup` direction.

**The group `Label`.** `SegmentedControl` is a form field — it wraps
react-aria's `RadioGroup` — so a `<Label>` inside it is a field label. `Tabs`
has no equivalent slot, and a tab list labels itself through its tab titles. So
the `Label` cannot move into `Tabs`: put its text in the surrounding `Section`'s
`Heading`, or drop it when that heading already names the group. A `Label` on
its own is **not** a signal that the usage was a `RadioGroup` case — plenty of
content switchers were authored with one, because the component required a field
label.

**Panels that register form fields.** Moving the switched-in content into a
`Tab` does not change when it mounts. `Tab` renders its panel with
`shouldForceMount` and wraps `Content` and `Section` in
`<Activity isActive={…}>`, so every tab's subtree is mounted and keeps its state
— an inactive tab is hidden, not unmounted. React Hook Form fields inside a tab
stay registered across a tab switch, exactly as they did as siblings below a
`SegmentedControl`.

There is no codemod, and the reason is the choice rather than the edit. Which
replacement is right cannot be decided from the source: a value-setting usage
and a content switcher look alike at the call site, and only the surrounding
intention separates them. The `RadioGroup` direction would be mechanical **once
that decision is made** — if you have many usages that all go that way, a
find-and-replace of `SegmentedControl`/`Segment` gets you most of it.

`SegmentedControl` and `Segment` (and the `flr-segmented-control` /
`flr-segment` remote elements) keep working unchanged and will be removed in a
future major version. `SegmentedControl` logs a deprecation warning at runtime;
`Segment` relies on it, since it only renders inside a `SegmentedControl`.

The `containerBreakpointSize` property has no counterpart: `Tabs` collapse on
their own when the available width runs out, and a `RadioGroup` stacks its
options anyway.
