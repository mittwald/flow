# ADR 0007 – Beta packages

- **Status:** Accepted
- **Date:** 2026-10-08
- **Deciders:** Flow team (m.falkenberg@mittwald.de)
- **Affects:** `@mittwald/flow-remote-vue-components` and any later framework
  binding, `apps/docs` (the Versionierung page), the version-contract guard
  (`.github/scripts/version-contract-lib.mjs`)

> This ADR lets a **whole package** be beta. It amends
> [ADR 0005](0005-semver-contract.md), whose contract applies uniformly to every
> package, and extends [ADR 0003](0003-component-lifecycle-status.md), which
> knows beta only per component. Raised in the review of
> [#3179](https://github.com/mittwald/flow/pull/3179), which adds the package.

## Context

ADR 0005 applies one contract to every fixed-versioned package and allows no
per-package special case except the stricter Node-entry packages (§2). Its only
exemption is ADR 0003's lifecycle status: a `@flowStatus beta` tag on a
component in `packages/components`, read into the status registry.

`@mittwald/flow-remote-vue-components` fits neither:

- **The whole package is young.** Its README lists gaps whose fixes may change
  its API — the `List` props it lacks, `Action`'s `actionConfirm`, the
  `flr-universal` compositions that may move behind generated elements.
- **The status registry cannot express it.** The registry lists the public
  components of `packages/components`. The Vue package's generated components
  take their props from those same components, so tagging them beta would exempt
  the React API too.
- **`0.x` is not available.** Fixed versioning gives every package the one
  shared version.

## Decision

### 1. A whole package may be beta

A package is beta when its `package.json` says `"flowStatus": "beta"`. That
field is the one marker tooling reads. A beta notice opens the package's README,
`USAGE.md` and `AGENTS.md`, and the docs site's Versionierung page names the
package. Today this is `@mittwald/flow-remote-vue-components` alone.

### 2. What beta exempts

**The package's own API is exempt from ADR 0005 §1**: its exports, the props,
slots and events its components accept, and how they map to the framework
(`v-model` bindings, slot names). **Its peer ranges are exempt from ADR 0005
§3**, the framework's (`vue`) among them. A breaking change to any of these may
ship in a Minor or Patch.

Such a change carries no breaking marker (`!`, `BREAKING CHANGE`): the marker
routes a commit to the major line
([ADR 0004](0004-forward-merge-main-into-next.md)). It ships a migration note in
the commit body and the release notes instead, as a deliberate type break does
(ADR 0005 §4).

It needs no entry in the migration catalogue
([ADR 0006](0006-migration-catalogue.md)). The catalogue covers
`@mittwald/flow-react-components` and `@mittwald/flow-remote-react-components`:
its guide is the React package's `MIGRATION.md`, and its codemods parse TSX, not
Vue templates. An entry for a Vue break would only add a manual step to every
React consumer's `upgrade`. The release note is the migration.

**Unchanged for a beta package:**

- the shared version and the release mechanics (ADR 0004);
- the Node floor (ADR 0005 §2), declared uniformly across packages;
- everything it builds on. The remote protocol and the `flr-*` elements belong
  to `remote-core` and `remote-elements`, and the props of `@flr-generate`
  components belong to `packages/components`. All of them stay under ADR 0005
  §1; a beta binding never licenses a break there.

### 3. How the beta ends

The beta ends when both hold:

- **The gaps are closed.** Every entry in the README's "Known gaps" is closed,
  or recorded there as permanent — a gap no API change of this package can
  close, such as `infiniteScroll`, which is inert in React too.
- **The surface has settled.** Closing what remains would not change an API the
  package ships.

One change then removes the `flowStatus` field and every beta notice from §1 and
records the ending version in an amendment to this ADR. From that release on,
ADR 0005 applies to the package in full.

### 4. Relation to ADR 0003 and ADR 0005

- **ADR 0005** — "one uniform contract, no per-package special-casing except §2"
  now reads "except §2 and a beta package".
- **ADR 0003** — beta means the same at package level: exempt from the
  breaking-change promise. The status registry stays per component and does not
  list packages; `flowStatus` borrows the name of its `@flowStatus` tag.
- **The version-contract guard** (`collectFindings` in
  `.github/scripts/version-contract-lib.mjs`) skips the peer ranges of a package
  that is beta at both the base and the head of a PR. It still checks the Node
  floor, and it checks a package that enters or leaves the beta in that PR in
  full. A future breaking-change guard reads the same field.

## Consequences

**Positive**

- A framework binding ships and gets used before its API is final, without
  exempting the React API it is generated from.
- The exemption has a defined end, written down once.

**Negative / trade-offs**

- Beta lives in two places: the registry for components, the `flowStatus` field
  for packages. The notices repeat the field, and nothing checks that they
  agree.
- An extension that adopts the package early carries breaking changes in Minor
  releases, with a migration note but no Major to plan around.
