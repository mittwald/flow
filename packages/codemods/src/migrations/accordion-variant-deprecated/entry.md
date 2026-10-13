---
since: 1.5.0
title: "Accordion: `variant` deprecated"
kind: deprecation
action: codemod
remotePackage: true
apply:
  'Remove the `variant` prop from every `Accordion` — a codemod does it. Then
  check where `variant="outline"` was used: where several accordions stand
  directly below each other, wrap them in an `AccordionGroup`, which draws
  separators between them; where a single accordion needs to stand apart from
  the surrounding content, place it in a `LayoutCard`. That part is not
  mechanically decidable.'
---

The `variant` prop of `Accordion` is deprecated. `variant="outline"` no longer
draws a frame, and `"default"` was the only other value, so the prop has no
effect anymore. It is still accepted and logs a deprecation warning; it will be
removed in a future major version. A codemod removes it.

Stacked accordions that used the outline to look separated get separators from
the new `AccordionGroup` instead. The group also replaces the gap the
surrounding layout put between them with a compact block.

```diff
- <Accordion variant="outline">
-   <Heading>Path parameters</Heading>
-   <Content>…</Content>
- </Accordion>
- <Accordion variant="outline">
-   <Heading>Query parameters</Heading>
-   <Content>…</Content>
- </Accordion>
+ <AccordionGroup>
+   <Accordion>
+     <Heading>Path parameters</Heading>
+     <Content>…</Content>
+   </Accordion>
+   <Accordion>
+     <Heading>Query parameters</Heading>
+     <Content>…</Content>
+   </Accordion>
+ </AccordionGroup>
```

There is no codemod for the grouping: whether accordions belong together in one
group depends on the layout around them, which the source does not tell.
