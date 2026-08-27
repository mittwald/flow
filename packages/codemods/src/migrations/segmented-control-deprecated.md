---
since: 0.2.0-alpha.1056
title: SegmentedControl deprecated
kind: deprecation
action: manual
remotePackage: true
apply:
  Replace `SegmentedControl` with `Tabs` when the selection switches displayed
  content, or with `RadioGroup` when it sets a value. Pick per usage — this is a
  structural change, not a rename.
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
`RadioGroup`: each `Segment` becomes a `Radio`, everything else — `Label`,
`FieldDescription`, `FieldError`, the React Hook Form binding — stays as it is.

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

There is no codemod. Both replacements change the structure, and picking the
right one is a decision per usage, not a rename.

`SegmentedControl` and `Segment` (and the `flr-segmented-control` /
`flr-segment` remote elements) keep working unchanged and will be removed in a
future major version. `SegmentedControl` logs a deprecation warning at runtime;
`Segment` relies on it, since it only renders inside a `SegmentedControl`.

The `containerBreakpointSize` property has no counterpart: `Tabs` collapse on
their own when the available width runs out, and a `RadioGroup` stacks its
options anyway.
