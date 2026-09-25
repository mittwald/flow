---
since: 0.2.0-alpha.1005
title: Closing a Modal with unsaved changes is confirmed by default
kind: migration
action: none
remotePackage: true
apply:
  "No code change required — if you had
  `requireCloseModalConfirmationOnUnsavedChanges` enabled, the new default
  matches it. To keep the previous behaviour (closing without confirmation),
  pass `confirmModalCloseOnUnsavedChanges={false}` to `Form` — this also works
  in remote apps (`@mittwald/flow-remote-react-components/react-hook-form`). To
  switch it off app-wide, set `Form: { confirmModalCloseOnUnsavedChanges: false
  }` via `<ComponentDefaultsProvider />` (not available in remote apps), or its
  deprecated equivalent, the
  `flags.requireCloseModalConfirmationOnUnsavedChanges = false` assignment."
---

A `Modal` that contains a react-hook-form `<Form>` now asks for confirmation
before it closes while the form is _dirty_ — previously this required the
`requireCloseModalConfirmationOnUnsavedChanges` flag. After a successful submit
or a `form.reset()` the modal closes right away, and actions in the
`<ActionGroup />` as well as the close button in the heading still close it
immediately.

Nothing to do if you had the flag enabled. To keep the previous behavior, opt
out per form:

```diff
- <Form form={form} onSubmit={onSubmit}>
+ <Form form={form} onSubmit={onSubmit} confirmModalCloseOnUnsavedChanges={false}>
```

Outside of remote apps you can switch the default off for the whole app instead
(see below).
