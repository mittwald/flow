# Performance measurements

Measures what Flow costs at runtime. Measurements, not tests: nothing asserts a
budget, and nothing runs in CI.

| File                  | Measures                                                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `List.perf.tsx`       | The `List` with 20–1000 items: mount, load more, search, filter, sort, re-render, view mode, scrolling, table view, infinite scroll                  |
| `components.perf.tsx` | Mount and re-render cost of ~40 components in their minimal usage, 200 instances each — the per-instance baseline                                    |
| `heavy.perf.tsx`      | Components whose cost grows with their input or that work on an interaction, each at several input sizes — see [Heavy components](#heavy-components) |
| `fibers.perf.tsx`     | React fibers and DOM nodes per list item, by component                                                                                               |

```shell
pnpm nx perf components                                 # every suite, Chromium
pnpm nx perf components -- dev/perf/List.perf.tsx       # one file
./dev/perf/run-all.sh                                   # full matrix, ~15 min
node dev/perf/summarize.mjs                             # results → markdown tables
```

Results are appended to `results/<browser>.jsonl` (gitignored), one line per
scenario with the median of its runs.

## Heavy components

Most components cost what their React tree costs; `components.perf.tsx` covers
those. These do more: they parse, highlight, lay out a chart, measure the DOM or
render a large collection. Each is measured at growing sizes:

- **mount**: fresh mount, plus fibers and DOM nodes.
- **re-render**: the parent re-renders, the props stay equal. Shows whether the
  component repeats its work.
- **update**: the input changes slightly — one edit, one data refresh.
- **interaction**: opening the popover, menu, dialog or preview, on a fresh
  mount.

| Component                        | Why it is expensive                                                                                     | Sizes                     | Measured                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------- |
| `Markdown`                       | react-markdown + remark-gfm parse the whole text on every render; each element becomes a Flow component | 1, 10, 50 sections        | mount, re-render, update          |
| `Markdown` with code blocks      | each fenced block becomes a `CodeBlock`, i.e. a CodeMirror instance                                     | 1, 10, 50 code blocks     | mount, re-render, update          |
| `MessageThread`, Markdown / Text | support ticket view: one `Markdown` per message; the Text variant is the baseline                       | 10, 50, 200 messages      | mount, re-render                  |
| `CodeBlock`                      | read-only CodeMirror: parser, syntax highlighting, line layout                                          | 20, 200, 2000 lines       | mount, re-render, update          |
| `CodeEditor`                     | CodeMirror with line numbers, folding and linter gutter                                                 | 20, 200, 2000 lines       | mount, re-render, update          |
| `MarkdownEditor`                 | auto-resizing `TextArea`; the preview renders `Markdown`                                                | 1, 10, 50 sections        | mount, re-render, update, preview |
| `CartesianChart`, Area / Bar     | recharts: scales, SVG paths, tick label measurement, `ResizeObserver`                                   | 10, 100, 1000 data points | mount, re-render, update          |
| `DonutChart`                     | SVG segments and legend                                                                                 | 1, 10, 50 instances       | mount, re-render, update          |
| `Table`                          | react-aria table collection, built twice (hidden collection document + real render)                     | 20, 100, 500 rows         | mount, re-render, update          |
| `Select`                         | react-aria collection; opening renders every option, without virtualization                             | 10, 100, 1000 options     | mount, re-render, open            |
| `ComboBox` + `CountryOptions`    | ~250 localized, sorted country options                                                                  | 1                         | mount, re-render, open            |
| `DatePicker`, `DateRangePicker`  | opening renders the calendar grid(s) with `@internationalized/date`                                     | 1                         | mount, re-render, open            |
| `ContextMenu`                    | overlay, focus management, menu collection                                                              | 5, 20 items               | mount, re-render, open            |
| `Modal` with a form              | overlay, focus trap, content mounted on open                                                            | 5, 20 fields              | mount, re-render, open            |
| `Tabs`                           | overflow observation and tab indicator measurement                                                      | 5, 20, 50 tabs            | mount, re-render                  |
| `TabNavigation`                  | measures its items to collapse the overflow into a menu                                                 | 5, 20, 50 links           | mount, re-render                  |
| `Truncate` with `offset`         | react-truncate-inside measures text width per instance                                                  | 10, 100, 500 instances    | mount, re-render                  |

Looked at, not measured:

- **`PasswordCreationField`**: the policy check runs debounced (350 ms) and
  async after typing; password generation runs in a web worker. Neither blocks a
  keystroke.
- **`ImageCropper`** (react-easy-crop): works only while the user drags.
- **`LoadingSpinner`, `NotificationProvider`** (framer-motion): cost per
  animation frame, not per mount — would need a frame-time scenario like the
  List's scrolling.
- **`CoachMark`**: while its target is missing it observes every mutation in
  `document.body`. Matters only while one is parked.
- **`Autocomplete`**: the consumer computes the suggestions; the rendering is
  the `Select`/`ComboBox` collection above.

## How it measures

- **Production React.** The config sets `NODE_ENV=production` and a
  non-development JSX transform; the dev build is several times slower and says
  nothing about what users get.
- **`total`** runs from the action (a model call such as
  `list().sorting[1].enable()`, a click, a mount) until neither a React commit
  nor a DOM mutation happened for three frames, and ends after the frame that
  followed the last one — roughly "until the result is painted". Debounces are
  not part of it: the search is set directly, not typed.
- **Reduced motion** in `heavy.perf.tsx`: a DOM-changing animation such as the
  `CartesianChart`'s would make `total` its duration instead of the render cost.
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
