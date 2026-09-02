#!/usr/bin/env bash
# Write the before/after sides of every changed `package.json` into
# $MANIFEST_SNAPSHOT_DIR, the layout `release-intent-guard.mjs` reads.
#
# Only the root and `packages/*` manifests: an `apps/*` manifest is irrelevant
# by path already. A missing side is the guard's fail-safe "relevant", which
# also covers an added or deleted manifest.
#
# $1 selects where the two sides come from — `git` needs history (the PR check
# has it), `api` needs none (the release job stays a shallow checkout).
# Changed paths arrive on stdin.
set -euo pipefail

source="${1:?usage: fetch-manifest-snapshots.sh git|api}"
: "${MANIFEST_SNAPSHOT_DIR:?}" "${BEFORE:?}" "${AFTER:?}"
mkdir -p "${MANIFEST_SNAPSHOT_DIR}/before" "${MANIFEST_SNAPSHOT_DIR}/after"

{ grep -E '^(package\.json|packages/[^/]+/package\.json)$' || true; } |
  while IFS= read -r manifest; do
    [ -n "$manifest" ] || continue
    slug="$(printf '%s' "$manifest" | sed 's|/|__|g')"
    for side in before after; do
      if [ "$side" = after ]; then ref="$AFTER"; else ref="$BEFORE"; fi
      target="${MANIFEST_SNAPSHOT_DIR}/${side}/${slug}.json"
      if [ "$source" = git ]; then
        git show "${ref}:${manifest}" > "$target" 2>/dev/null || rm -f "$target"
      elif ! gh api "repos/${REPO}/contents/${manifest}?ref=${ref}" \
        --header 'Accept: application/vnd.github.raw+json' > "$target"; then
        echo "::warning::Could not fetch ${manifest} at ${ref}."
        rm -f "$target"
      fi
    done
  done
