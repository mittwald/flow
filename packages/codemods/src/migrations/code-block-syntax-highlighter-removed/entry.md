---
since: 0.2.0-alpha.756
title: Removed the underlying react-syntax-highlighter library from CodeBlock
kind: migration
action: codemod
remotePackage: true
apply: >-
  Remove these props from every `CodeBlock`: `color`, `style`, `customStyle`,
  `codeTagProps`, `useInlineStyles`, `showInlineLineNumbers`,
  `startingLineNumber`, `lineNumberContainerStyle`, `lineNumberStyle`,
  `wrapLines`, `wrapLongLines`, `lineProps`, `renderer`, `PreTag`, `CodeTag`.
  They were re-exported from `react-syntax-highlighter` and none of them exists
  any more. `code`, `copyable`, `language`, `showLineNumbers`, `className` and
  the children stay — note that `showLineNumbers` survived and
  `showInlineLineNumbers` did not. A codemod removes all fifteen. Two things it
  declines: a spread that might carry one (`<CodeBlock {...props} />`), and
  `code`, which narrowed from `string | string[]` to `string` — join an array
  yourself, with the line separator you want.
---

We've replaced the `react-syntax-highlighter` library, which means many
properties have been removed and the remaining ones have been simplified. See
the
[CodeBlock documentation](https://flow.mittwald.de/components/content/code-block)
for details on what's now supported.

```diff
  <CodeBlock
    code="const a = 1;"
    language="ts"
    showLineNumbers
-   wrapLongLines
-   startingLineNumber={5}
-   useInlineStyles={false}
  />
```

`style` is in the removed set and is easy to misread: on `CodeBlock` it was
never the DOM `style` attribute, it was the highlighter's theme object. There is
no `style` prop on the component now.

`code` no longer accepts `string[]`. Where you passed an array, join it — the
separator is yours to choose, which is why no codemod does it for you.

The prop that replaces most of what the removed ones were used for is
`truncateLines`: `false` (the default) disables truncation, `true` truncates
after 8 lines, and a number sets the maximum line count.
