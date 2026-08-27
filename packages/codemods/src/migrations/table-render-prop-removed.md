---
since: 0.2.0-alpha.866
title: "Table: `render` prop removed"
kind: migration
action: manual
remotePackage: true
detect: rg -t ts 'render=\{'
apply:
  Replace the `render` escape hatch on `Table` with a composition of
  `TableHeader`, `TableColumn`, `TableBody`, `TableRow` and `TableCell`.
verify: tsc --noEmit passes, and `rg 'render=\{'` finds nothing.
---

The `render` escape hatch on `Table` has been removed. Compose the table from
`TableHeader`, `TableColumn`, `TableBody`, `TableRow` and `TableCell` instead.
