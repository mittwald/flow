---
since: 1.2.10
title: "Image: rounded corners by default, withBorder draws only the border"
kind: migration
action: none
remotePackage: true
apply:
  "No code change required. To keep square corners on an `Image` without
  `withBorder`, pass `withRoundedCorners={false}`."
---

`Image` now has rounded corners by default, with or without a border. Previously
only `withBorder` rounded them. `withBorder` now draws only the border, and the
new `withRoundedCorners` prop (default `true`) controls the corner radius on its
own. The border color is also more muted.

Keep square corners where an image needs them:

```diff
- <Image src={src} alt="" />
+ <Image src={src} alt="" withRoundedCorners={false} />
```
