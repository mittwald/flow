import type { ProfilerOnRenderCallback, ReactNode } from "react";
import { Profiler } from "react";
import { createRoot, type Root } from "react-dom/client";
import { commands } from "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    recordPerfResult: (result: unknown) => Promise<void>;
    startCpuProfile: () => Promise<void>;
    setCpuThrottling: (rate: number) => Promise<void>;
    stopCpuProfile: (name: string) => Promise<void>;
  }
}

interface Commit {
  id: string;
  phase: string;
  actualDuration: number;
  startTime: number;
  commitTime: number;
}

const commits: Commit[] = [];
let sawCommit = false;
/** Bumped by fixtures, e.g. once per call of an item's render function. */
export const counters = { itemRenders: 0 };

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  _baseDuration,
  startTime,
  commitTime,
) => {
  sawCommit = true;
  commits.push({ id, phase, actualDuration, startTime, commitTime });
};

let root: Root | undefined;
let host: HTMLElement | undefined;

let throttled = false;
/** Applies VITE_PERF_CPU_THROTTLE (CDP CPU throttling, Chromium only) once. */
export const applyThrottle = async () => {
  const rate = Number(import.meta.env.VITE_PERF_CPU_THROTTLE ?? 1);
  if (!throttled && rate > 1) {
    await commands.setCpuThrottling(rate);
    throttled = true;
  }
};

export const mount = (node: ReactNode) => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  root.render(
    <Profiler id="root" onRender={onRender}>
      {node}
    </Profiler>,
  );
};

export const getHost = () => host;

export const unmount = async () => {
  root?.unmount();
  host?.remove();
  root = undefined;
  host = undefined;
  await nextFrame();
};

/** Resolves after the next frame has been rendered (approx. "next paint"). */
export const nextFrame = () =>
  new Promise<void>((res) =>
    requestAnimationFrame(() => {
      const ch = new MessageChannel();
      ch.port1.onmessage = () => res();
      ch.port2.postMessage(null);
    }),
  );

export interface Measurement {
  /** Action start → the frame after the last commit or DOM mutation. */
  total: number;
  /** React render+commit work (`<Profiler>`); 0 unless PERF_REACT_PROFILING=1. */
  react: number;
  commits: number;
  itemRenders: number;
  /** Longest main-thread task (Long Tasks API: >= 50 ms, else 0; Chromium). */
  longestTask: number;
  /** Sum of all long tasks: time the main thread was blocked. */
  longTasksTotal: number;
  domNodes: number;
}

/**
 * Runs `action`, then waits until neither React nor the DOM changed for
 * `quietFrames` frames. `total` ends after the frame that followed the last
 * activity, which approximates "until the result is painted".
 */
export const measure = async (
  action: () => unknown,
  opts: { quietFrames?: number; profile?: string } = {},
): Promise<Measurement> => {
  const { quietFrames = 3, profile } = opts;
  if (profile) {
    await commands.startCpuProfile();
  }
  commits.length = 0;
  counters.itemRenders = 0;

  const tasks: PerformanceEntry[] = [];
  const po = new PerformanceObserver((list) => {
    tasks.push(...list.getEntries());
  });
  try {
    po.observe({ type: "longtask" });
  } catch {
    // not supported (webkit/firefox)
  }

  /*
   * Activity = a React commit (profiling build) or a DOM mutation (any build),
   * so the measurement also works without the profiling build.
   */
  let mutations = 0;
  const mo = new MutationObserver((records) => {
    mutations += records.length;
  });
  mo.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });
  const activity = () => commits.length + mutations;

  const t0 = performance.now();
  await action();
  let tEnd = performance.now();
  let quiet = 0;
  let first = true;
  const deadline = t0 + 30_000;
  while (quiet < quietFrames && performance.now() < deadline) {
    const before = activity();
    await nextFrame();
    // MutationObserver callbacks are microtasks; they have run by now
    if (first || activity() > before) {
      tEnd = performance.now();
      quiet = 0;
    } else {
      quiet++;
    }
    first = false;
  }
  mo.disconnect();
  if (profile) {
    await commands.stopCpuProfile(profile);
  }
  // flush pending long task entries
  await new Promise((r) => setTimeout(r, 50));
  tasks.push(...po.takeRecords());
  po.disconnect();

  const relevant = tasks.filter((t) => t.startTime + t.duration >= t0);

  return {
    total: tEnd - t0,
    react: commits.reduce((s, c) => s + c.actualDuration, 0),
    commits: commits.length,
    itemRenders: counters.itemRenders,
    longestTask: Math.max(0, ...relevant.map((t) => t.duration)),
    longTasksTotal: relevant.reduce((s, t) => s + t.duration, 0),
    domNodes: document.getElementsByTagName("*").length,
  };
};

/** Throws instead of letting a missing fixture part turn into a bogus number. */
export const defined = <T,>(value: T | null | undefined, what: string): T => {
  if (value === null || value === undefined) {
    throw new Error(`Missing ${what}`);
  }
  return value;
};

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  const at = (i: number) => defined(s[i], "measurement");
  return s.length % 2 ? at(m) : (at(m - 1) + at(m)) / 2;
};

const round = (x: number) => Math.round(x * 10) / 10;

export const summarize = (ms: Measurement[]): Measurement => {
  const keys = Object.keys(
    defined(ms[0], "measurement"),
  ) as (keyof Measurement)[];
  return Object.fromEntries(
    keys.map((k) => [k, round(median(ms.map((m) => m[k])))]),
  ) as unknown as Measurement;
};

export const record = async (
  scenario: string,
  params: Record<string, unknown>,
  ms: Measurement[],
) => {
  const result = {
    scenario,
    ...params,
    throttle: Number(import.meta.env.VITE_PERF_CPU_THROTTLE ?? 1),
    reactBuild: sawCommit ? "profiling" : "production",
    runs: ms.length,
    ...summarize(ms),
    max: round(Math.max(...ms.map((m) => m.total))),
  };
  await commands.recordPerfResult(result);
  return result;
};

export const waitFor = async (
  predicate: () => boolean,
  timeout = 20_000,
): Promise<void> => {
  const start = performance.now();
  while (!predicate()) {
    if (performance.now() - start > timeout) {
      throw new Error("waitFor timed out");
    }
    await nextFrame();
  }
};
