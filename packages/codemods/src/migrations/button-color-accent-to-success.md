---
since: 0.2.0-alpha.1046
title: "Button: color `accent` renamed to `success`"
kind: migration
action: codemod
remotePackage: true
apply:
  Rename `color="accent"` to `color="success"` on `Button` and `SubmitButton`.
  Also update the CSS class `flow--button--accent` to `flow--button--success`
  and every `--button--accent-{solid,plain,soft,outline}-*` design token to its
  `success` counterpart if you use `@mittwald/flow-stylesheet` or the token CSS
  variables directly — those have no fallback.
---

The button color `accent` is now called `success` — the name says what the color
means instead of how it looks.

```diff
- <Button color="accent">Speichern</Button>
+ <Button color="success">Speichern</Button>
```

`color="accent"` keeps working and logs a deprecation warning, but will be
removed in a future release. A codemod rewrites it on `Button` and
`SubmitButton`.

The CSS class and the design tokens are renamed **without** a fallback — update
them by hand if you use `@mittwald/flow-stylesheet` or the token CSS variables
directly:

```diff
- <button class="flow--button flow--button--accent">
+ <button class="flow--button flow--button--success">
```

```diff
- var(--button--accent-solid-background-color--default)
+ var(--button--success-solid-background-color--default)
```

The same rename applies to every `--button--accent-{solid,plain,soft,outline}-*`
variable. `Chat`'s internal class `flow--chat--accent-button` became
`flow--chat--success-button`.
