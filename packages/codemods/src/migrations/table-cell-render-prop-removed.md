---
since: 0.2.0-alpha.846
title: "TableCell: `render` prop removed"
kind: migration
action: manual
remotePackage: true
apply:
  Provide the cell content as children of `TableCell` instead of a `render`
  function.
---

The `render` escape hatch on `TableCell` has been removed. Provide the cell
content as children instead.

```diff
- <TableCell render={(cell) => <CustomCell {...cell} />} />
+ <TableCell>
+  <CustomCell />
+ </TableCell>
```
