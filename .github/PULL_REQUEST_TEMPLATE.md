<!--
  Thanks for contributing to Flow! Full guide:
  https://github.com/mittwald/flow/blob/main/CONTRIBUTE.md
-->

## What & why

<!-- What does this change do, and why? Link related issues (e.g. Closes #123). -->

## Base branch & title

Your **PR title** must be a valid
[Conventional Commit](https://www.conventionalcommits.org/) (e.g.
`fix(Button): correct focus ring`) — a squash merge turns it into the release
commit. Your **branch commits** count too: a merge commit brings each of them
onto the line. A CI guard checks that the title and every commit match the base
branch. Pick the base by change type
([details](https://github.com/mittwald/flow/blob/main/CONTRIBUTE.md#choosing-the-base-branch)):

- `fix:` / `docs:` / `chore:` / `refactor:` / … → base **`main`**
- `feat:` (new feature) → base **`next`**
- Breaking change (`feat!:` / `BREAKING CHANGE:`) → base **the major line**

> A major line only exists while a breaking change is being collected — ask a
> maintainer before opening one.

## Checklist

- [ ] PR title is a Conventional Commit and matches the base branch above
- [ ] `pnpm lint` is clean and `pnpm affected:test` passes (browser tests if
      behavior changed)
- [ ] **Generated code is committed** (`git diff` is empty after the relevant
      `build:*` targets)
- [ ] User-facing strings added to **both** `de-DE` and `en-US` locale files
- [ ] Docs updated if a public API changed; intentional visual changes get
      updated snapshots / the `update-screenshots` label
