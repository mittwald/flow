#!/usr/bin/env bash
# Usage: fetch-debs.sh <browser>...
#
# Downloads the .debs `playwright install --with-deps <browser>...` is about to
# install into apt's archive, 16 at a time. apt fetches them one by one over a
# single connection and never gives up on a slow transfer. Here a stalled
# transfer moves on to the next mirror, and the whole fetch has a deadline. apt
# still downloads whatever is missing afterwards, so a failure here only costs
# time.
set -uo pipefail

archives=${ARCHIVES:-/var/cache/apt/archives}
export mirrors="http://azure.archive.ubuntu.com/ubuntu https://archive.ubuntu.com/ubuntu"

sudo apt-get update -qq
packages=$(pnpm exec playwright install-deps --dry-run "$@" | sed -n 's/^  //p')
[ -n "$packages" ] || exit 0

export work
work=$(mktemp -d)
# Lists only files missing from the archive, one per line:
# '<uri>/pool/main/f/foo/foo_1.0_amd64.deb' foo_1.0_amd64.deb <size> <hash>
# shellcheck disable=SC2086 # one argument per package
sudo apt-get install --print-uris -qq --no-install-recommends \
  -o Dir::Cache::Archives="$archives" $packages |
  sed -n "s|^'[^']*\(/pool/[^']*\)' \([^ ]*\) .*|\1 \2|p" > "$work/list"

fetch() { # <pool path> <archive file name>
  for mirror in $mirrors; do
    curl -fsS --connect-timeout 10 --speed-limit 20000 --speed-time 15 \
      -o "$work/$2.part" "$mirror$1" && mv "$work/$2.part" "$work/$2" && return
  done
}
export -f fetch

start=$SECONDS
timeout 5m xargs -r -P 16 -n 2 bash -c 'fetch "$@"' _ < "$work/list"
fetched=$(find "$work" -name '*.deb' | wc -l)
sudo find "$work" -name '*.deb' -exec mv -t "$archives" {} +
echo "Fetched $fetched of $(wc -l < "$work/list") .debs in $((SECONDS - start)) s."
