---
since: 0.2.0-alpha.956
title: "TableColumn: `maxWidth` removed, `width` and `minWidth` retyped"
kind: migration
action: codemod
remotePackage: true
apply: >-
  Remove `maxWidth` from every `TableColumn`. Where `width` or `minWidth` was
  `null`, omit the prop instead — the type no longer accepts `null`, only
  `number | string`. A codemod does both for the cases it can decide from the
  source. Two it declines: a `width`/`minWidth` whose value is an expression
  (`width={maybeNull}`), and a spread that might carry `maxWidth` (`<TableColumn
  {...props} />`). Check those by hand.
---

`maxWidth` has been removed. `width` and `minWidth` are now typed as
`number | string`: they no longer accept `null`, and the previous
template-literal typing (`` `${number}%` ``, `` `${number}fr` ``) is replaced by
a plain `string`.

```diff
- <TableColumn width="50%" minWidth={null} maxWidth={400} />
+ <TableColumn width="50%" />
```

Percentage, pixel and `fr` values keep working as strings or numbers
(`width="50%"`, `width="200fr"`, `width={300}`). Where you passed `null` to mean
"no explicit width", omit the prop instead.

A codemod removes `maxWidth` — the prop is gone from the type, so an explicit
attribute is wrong at any value, an expression included — and removes a `width`
or `minWidth` written as the literal `null`.

It declines what it cannot decide from the source: `width={maybeNull}` could be
anything at runtime, and a spread's contents are invisible. Both keep their
props and need a look by hand.
