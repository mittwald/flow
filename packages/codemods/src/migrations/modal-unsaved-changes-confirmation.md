---
since: 0.2.0-alpha.1005
title: Closing a Modal with unsaved changes is confirmed by default
kind: migration
action: none
remotePackage: true
apply:
  "No code change required — if you had
  `requireCloseModalConfirmationOnUnsavedChanges` enabled, the new default
  matches it. To keep the previous behaviour (closing without confirmation), set
  `Form: { confirmModalCloseOnUnsavedChanges: false }` via
  `<ComponentDefaultsProvider />`, or its deprecated equivalent, the
  `flags.requireCloseModalConfirmationOnUnsavedChanges = false` assignment."
verify:
  Nothing to verify — the change is in Flow's own behaviour. If you opted out,
  confirm a Modal with a dirty form still closes without confirmation.
---

A `Modal` that contains a react-hook-form `<Form>` now asks for confirmation
before it closes while the form is _dirty_ — previously this required the
`requireCloseModalConfirmationOnUnsavedChanges` flag. After a successful submit
or a `form.reset()` the modal closes right away, and actions in the
`<ActionGroup />` as well as the close button in the heading still close it
immediately.

Nothing to do if you had the flag enabled. To keep the previous behavior, switch
the default off (see below).
