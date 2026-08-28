---
since: 0.2.0-alpha.956
title: "TableColumn: `maxWidth` removed, `width` and `minWidth` retyped"
kind: migration
action: manual
remotePackage: true
detect: rg -t ts 'maxWidth|[wW]idth=\{null\}'
apply:
  Remove `maxWidth` from every `TableColumn`. Where `width` or `minWidth` was
  `null`, omit the prop instead — the type no longer accepts `null`, only
  `number | string`.
verify:
  tsc --noEmit passes, and `rg 'maxWidth'` finds no remaining `TableColumn`
  usage.
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
