---
since: 0.2.0-alpha.1047
title: Align renamed to Combine
kind: migration
action: codemod
remotePackage: true
detect: rg -t ts '\bAlign(Props)?\b'
apply:
  Rename `Align` to `Combine` and `AlignProps` to `CombineProps`, for named,
  aliased and namespace imports from a Flow package.
verify: tsc --noEmit passes, and `rg '\bAlign\b'` finds no Flow import.
---

`Align` is now called `Combine`. The old name suggested a generic alignment tool
and clashed with the `align` property of `Flex`; the component actually gives
known combinations of components a fixed, correct arrangement.

```diff
- <Align>
+ <Combine>
    <Avatar />
    <Text>Max Mustermann</Text>
- </Align>
+ </Combine>
```

`Align` (and the `flr-align` remote element) keeps working unchanged, logs a
deprecation warning at runtime, and will be removed in a future major version.

The component tokens were renamed along with the component
(`--align--avatar-text--spacing` is now `--combine--avatar-text--spacing`), and
so were the CSS class names (`.flow--align` is now `.flow--combine`). Both are
internal and not covered by Semantic Versioning.
