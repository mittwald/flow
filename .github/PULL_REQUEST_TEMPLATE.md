<!--
  Thanks for contributing to Flow! Full guide:
  https://github.com/mittwald/flow/blob/main/CONTRIBUTE.md
-->

## What & why

<!-- What does this change do, and why? Link related issues (e.g. Closes #123). -->

## Base branch & title

This repo **squash-merges**, so your **PR title becomes the release commit** —
it must be a valid [Conventional Commit](https://www.conventionalcommits.org/)
(e.g. `fix(Button): correct focus ring`). A CI guard lints the title _and_ that
it matches the base branch. Pick the base by change type
([details](https://github.com/mittwald/flow/blob/main/CONTRIBUTE.md#choosing-the-base-branch)):

- `fix:` / `docs:` / `chore:` / `refactor:` / … → base **`main`**
- `feat:` (new feature) → base **`next`**
- Breaking change (`feat!:` / `BREAKING CHANGE:`) → base **the major line**

> Before the 1.0.0 cut the `next` / major lines don't exist yet, so everything
> targets `main` and the routing guard stays dormant.

## Checklist

- [ ] PR title is a Conventional Commit and matches the base branch above
- [ ] `pnpm lint` is clean and `pnpm affected:test` passes (browser tests if
      behavior changed)
- [ ] **Generated code is committed** (`git diff` is empty after the relevant
      `build:*` targets)
- [ ] User-facing strings added to **both** `de-DE` and `en-US` locale files
- [ ] Docs updated if a public API changed; intentional visual changes get
      updated snapshots / the `update-screenshots` label
