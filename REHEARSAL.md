# 1.0.0 cut rehearsal — scratch branch

**This branch must never be merged into `mittwald/flow`.** It exists to be
pushed to a throwaway fork, where it rehearses the 1.0.0 cut against a
throwaway registry. See [issue #2769](https://github.com/mittwald/flow/issues/2769)
for the phased runbook and the verification criteria; this file only covers the
fork-local setup.

## What this branch changes

1. **Cherry-picks the cut changes from
   [#2759](https://github.com/mittwald/flow/pull/2759)** — stable-`main`
   publishing plus the `release_as` / `dry_run` dispatch inputs. `release_as` is
   what produces `1.0.0` in Phase 2.
2. **Redirects publishing to Verdaccio** — in `publish.yml` and
   `publish-next.yml`, only the `setup-node` step and one `env:` on the publish
   step. The `lerna publish` invocations are byte-identical to production, which
   is the entire point of the exercise.
3. **Deletes every workflow except the four under test** — `publish.yml`,
   `publish-next.yml`, `forward-merge.yml`, `commit-guard.yml`. Otherwise each
   push fires half of production CI with missing secrets and drowns the signal.

## Setup on the fork

The fork must be **public**. The self-gating checks in `forward-merge.yml` and
`commit-guard.yml` use an unauthenticated
`git ls-remote https://github.com/$REPO.git next`. On a private repo that always
fails, the guards conclude `next` does not exist, and the whole cascade stays
dormant while every run still looks green.

| Kind     | Name                   | Value                                                                                                                  |
| -------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Secret   | `PUBLISH_PAT`          | Fine-grained PAT whose **repository selection contains only the fork** — Contents: write, Pull requests: write, Issues: write |
| Secret   | `REHEARSAL_NPM_TOKEN`  | Verdaccio token (`npm adduser --registry <ingress>`)                                                                   |
| Variable | `REHEARSAL_REGISTRY`   | The Verdaccio ingress URL, e.g. `https://verdaccio.example.mittwald.space`                                             |

Scoping the PAT to the fork alone is the load-bearing safety control: it makes
writing to `mittwald/flow` physically impossible, rather than merely unintended.
A PAT is also mandatory for the rehearsal to work at all — pushes made with
`GITHUB_TOKEN` do not trigger `push:` workflows, so the
`publish → push main → forward-merge → push next → publish-next` chain would
never fire.

Also: enable Actions (off by default on forks), and confirm the fork carries no
npm token of any kind.

The Verdaccio container config is in
[`rehearsal/verdaccio.config.yaml`](rehearsal/verdaccio.config.yaml). It needs a
persistent volume on `/verdaccio/storage` — persistence across workflow runs is
what makes the Phase 5 assertion (`latest` must not move when `next` publishes)
observable at all.

## Teardown

Delete the fork, delete the Verdaccio container **and its volume**, revoke the
scratch PAT, then confirm npmjs is untouched:

```
npm view @mittwald/flow-react-components versions --registry https://registry.npmjs.org
```

`1.0.0` must not appear, and `mittwald/flow` must carry no new tags or releases.
