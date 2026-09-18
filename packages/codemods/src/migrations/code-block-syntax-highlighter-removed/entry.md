---
since: 0.2.0-alpha.756
title: Removed the underlying react-syntax-highlighter library from CodeBlock
kind: migration
action: manual
remotePackage: true
apply: >-
  Remove these props from every `CodeBlock`: `color`, `style`, `customStyle`,
  `codeTagProps`, `useInlineStyles`, `showInlineLineNumbers`,
  `startingLineNumber`, `lineNumberContainerStyle`, `lineNumberStyle`,
  `wrapLines`, `wrapLongLines`, `lineProps`, `renderer`, `PreTag`, `CodeTag`.
  They were `react-syntax-highlighter`'s own props and have no counterpart —
  there is nothing to replace them with, and styling and line rendering are no
  longer configurable from the call site. `copyable`, `code`, `language`,
  `showLineNumbers`, `className` and children all stay. `code` narrowed from
  `string | string[]` to `string`: where an array was passed, join it
  (`code={lines.join("\n")}`).
---

We've replaced the `react-syntax-highlighter` library with Flow's own
`CodeEditor`. Everything that configured the highlighter is gone; what is left
is the small set of props the component itself owns.

Removed, with no replacement: `color` (already deprecated), `style`,
`customStyle`, `codeTagProps`, `useInlineStyles`, `showInlineLineNumbers`,
`startingLineNumber`, `lineNumberContainerStyle`, `lineNumberStyle`,
`wrapLines`, `wrapLongLines`, `lineProps`, `renderer`, `PreTag` and `CodeTag`.
Appearance and line rendering now come from the component, not the call site.

Kept: `copyable`, `code`, `language`, `showLineNumbers`, `className` and
children.

`code` is now `string` only — it used to accept `string | string[]`.

```diff
- <CodeBlock code={lines} language="ts" wrapLongLines showLineNumbers />
+ <CodeBlock code={lines.join("\n")} language="ts" showLineNumbers />
```

See the
[CodeBlock documentation](https://flow.mittwald.de/components/content/code-block)
for what the current props do.
