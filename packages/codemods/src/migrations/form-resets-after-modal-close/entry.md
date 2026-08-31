---
since: 0.2.0-alpha.694
title: "Form: resets itself after the surrounding modal closes"
kind: migration
action: none
remotePackage: false
apply:
  "No code change required. To keep the previous behaviour (the form keeping
  what the user entered), pass `autoReset={false}` (or `autoReset={{
  onAfterModalClose: false }}`) to `Form`."
---

A react-hook-form `<Form>` inside a `Modal` now resets to its default values
once the modal has closed. Previously it kept what the user had entered, so
reopening the modal showed the abandoned input.

Opt out per form with the new `autoReset` prop:

```diff
- <Form form={form} onSubmit={onSubmit}>
+ <Form form={form} onSubmit={onSubmit} autoReset={false}>
```

`autoReset` also takes an object (`autoReset={{ onAfterModalClose: false }}`) so
further reset triggers can be added without another prop.
