# Performance measurements

Measures what Flow costs at runtime: the `List` with 20–1000 items (mount, load
more, search, filter, sort, re-render, view mode, scrolling, table view,
infinite scroll) and the mount and re-render cost of ~40 common components, 200
instances each. Measurements, not tests: nothing asserts a budget, and nothing
runs in CI.

```shell
pnpm nx perf components                                 # List + components, Chromium
pnpm nx perf components -- dev/perf/List.perf.tsx       # one file
./dev/perf/run-all.sh                                   # full matrix, ~15 min
node dev/perf/summarize.mjs                             # results → markdown tables
```

Results are appended to `results/<browser>.jsonl` (gitignored), one line per
scenario with the median of its runs.

## How it measures

- **Production React.** The config sets `NODE_ENV=production` and a
  non-development JSX transform; the dev build is several times slower and says
  nothing about what users get.
- **`total`** runs from the action (a model call such as
  `list().sorting[1].enable()`, a click, a mount) until neither a React commit
  nor a DOM mutation happened for three frames, and ends after the frame that
  followed the last one — roughly "until the result is painted". Debounces are
  not part of it: the search is set directly, not typed.
- **`itemRenders`** counts calls of the fixture's item render function — how
  many items re-rendered.
- **`longestTask` / `longTasksTotal`**: Long Tasks API (≥ 50 ms), Chromium only.
- **Scrolling** steps through the page 120 px per frame and reports frame-time
  p50/p95/max.

## Knobs

| Variable                 | Effect                                                                        |
| ------------------------ | ----------------------------------------------------------------------------- |
| `PERF_BROWSER`           | `chromium` (default), `webkit`, `firefox`                                     |
| `PERF_RESULTS`           | results file (default `results/<browser>.jsonl`)                              |
| `PERF_REACT_PROFILING=1` | React's profiling build: `react`/`commits` get filled, at ~10 % overhead      |
| `VITE_PERF_SIZES`        | list sizes, default `20,100,200,500,1000`                                     |
| `VITE_PERF_RUNS`         | runs per scenario, default `5`                                                |
| `VITE_PERF_INSTANCES`    | instances per component in `components.perf.tsx`, default `200`               |
| `VITE_PERF_CPU_THROTTLE` | CPU slowdown factor via the DevTools protocol (Chromium); `4` ≈ office laptop |

## Finding the cause

- `List.profile.perf.tsx` records a CPU profile per scenario into
  `results/profiles/`. Open one in Chrome DevTools (Performance → Load profile),
  or summarize it right after the run — the summary maps vite's pre-bundled
  chunks back through their source maps, which the next run replaces:
  `node dev/perf/analyzeProfile.mjs dev/perf/results/profiles/sort-200.cpuprofile`
- `fibers.perf.tsx` counts the React fibers and DOM nodes one list item costs,
  by component.

## Reading the numbers

Absolute values depend on the machine and on what else runs on it — compare runs
from the same machine, ideally idle, and look at how a scenario scales with `n`.
A `total` includes a fixed floor of one to two frames (~17–33 ms). Only the
local rendering path is measured; an mStudio extension additionally serializes
every mutation to the host.
