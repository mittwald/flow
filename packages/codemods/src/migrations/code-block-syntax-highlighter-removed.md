---
since: 0.2.0-alpha.756
title: Removed the underlying react-syntax-highlighter library from CodeBlock
kind: migration
action: manual
remotePackage: true
detect: rg -t ts 'CodeBlock'
apply:
  Check every `CodeBlock` usage against the current props (see the [CodeBlock
  documentation](https://flow.mittwald.de/04-components/content/code-block/overview))
  and remove or replace props the new implementation does not support.
verify: tsc --noEmit passes — a removed prop surfaces as a type error.
---

We've replaced the `react-syntax-highlighter` library, which means many
properties have been removed and the remaining ones have been simplified. See
the
[CodeBlock documentation](https://flow.mittwald.de/04-components/content/code-block/overview)
for details on what's now supported.
