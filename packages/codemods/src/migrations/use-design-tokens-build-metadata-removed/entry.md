---
since: 1.0.16
title: "useDesignTokens(): no longer returns style-dictionary build metadata"
kind: migration
action: manual
remotePackage: false
apply:
  Only affects code reading `filePath`, `isSource`, `original`, `name`,
  `attributes` or `key` off a token returned by `useDesignTokens()`. Those
  fields are gone; read them from
  `@mittwald/flow-design-tokens/json/all-light.json` (or `all-dark.json`)
  instead, and never from browser code. `value` and `path` are unchanged — code
  using only those needs no change.
---

The hook imported the design tokens' full style-dictionary output, which carries
`filePath`, `isSource`, `original`, `name`, `attributes` and `key` on every one
of the 1538 tokens. That metadata is 94 % of the payload and meant nothing in a
browser — it put 1.37 MB of JavaScript into every bundle that touched the
package. The hook now reads a runtime build of the same tokens.

Every token keeps `value` and `path`, unchanged and with identical values, so
the common access patterns are untouched:

```tsx
const tokens = useDesignTokens();
tokens["loading-spinner"]["transition-duration"].value; // still works
tokens.axis.color.path; // still works
```

Only the build metadata is gone. If you read one of those fields, take it from
`@mittwald/flow-design-tokens/json/all-light.json` (or `all-dark.json`) directly
— that artifact is unchanged. Do not import it into browser code; it is the
reason this change exists.

```diff
- const source = useDesignTokens().button["corner-radius"].filePath;
+ import tokens from "@mittwald/flow-design-tokens/json/all-light.json";
+ const source = tokens.button["corner-radius"].filePath;
```
