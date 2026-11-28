#!/usr/bin/env bash
# The full measurement matrix. Results: dev/perf/results/<name>.jsonl, then
# `node dev/perf/summarize.mjs`. Takes ~15 minutes; keep the machine idle.
set -euo pipefail
cd "$(dirname "$0")/../.."
results="$PWD/dev/perf/results"
mkdir -p "$results"
rm -f "$results"/list-*.jsonl "$results"/components-*.jsonl \
  "$results"/heavy-*.jsonl "$results"/fibers.jsonl

run() {
  local name=$1 file=$2
  shift 2
  echo "== $name"
  env PERF_RESULTS="$results/$name.jsonl" "$@" \
    npx vitest run --config dev/perf/vitest.perf.config.ts "$file"
}

run fibers dev/perf/fibers.perf.tsx
run list-chromium dev/perf/List.perf.tsx VITE_PERF_RUNS=5
run components-chromium dev/perf/components.perf.tsx VITE_PERF_RUNS=5
run heavy-chromium dev/perf/heavy.perf.tsx VITE_PERF_RUNS=5
run list-chromium-4x dev/perf/List.perf.tsx VITE_PERF_RUNS=3 \
  VITE_PERF_SIZES=100,200,500 VITE_PERF_CPU_THROTTLE=4
run components-chromium-4x dev/perf/components.perf.tsx VITE_PERF_RUNS=3 \
  VITE_PERF_CPU_THROTTLE=4
run heavy-chromium-4x dev/perf/heavy.perf.tsx VITE_PERF_RUNS=3 \
  VITE_PERF_CPU_THROTTLE=4
run list-webkit dev/perf/List.perf.tsx PERF_BROWSER=webkit VITE_PERF_RUNS=3 \
  VITE_PERF_SIZES=100,200,1000
run heavy-webkit dev/perf/heavy.perf.tsx PERF_BROWSER=webkit VITE_PERF_RUNS=3
