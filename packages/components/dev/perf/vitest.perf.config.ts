import defaultConfig from "../../vite.config.ts";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { unlayeredStylesPlugin } from "../vite/unlayeredStylesPlugin.ts";
import type { BrowserCommand } from "vitest/node";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import type { CDPSession, Page } from "playwright";
import { dirname, join } from "node:path";

const browser = process.env.PERF_BROWSER ?? "chromium";

const resultsFile =
  process.env.PERF_RESULTS ??
  join(import.meta.dirname, "results", `${browser}.jsonl`);

const recordPerfResult: BrowserCommand<[result: unknown]> = (_ctx, result) => {
  mkdirSync(dirname(resultsFile), { recursive: true });
  appendFileSync(resultsFile, JSON.stringify(result) + "\n");
};

/* Chromium only: CPU profiles and CPU throttling go through the DevTools protocol. */
const cdpSessions = new WeakMap<Page, CDPSession>();

const getCdp = async (ctx: unknown) => {
  const { page } = ctx as { page: Page };
  let cdp = cdpSessions.get(page);
  if (!cdp) {
    cdp = await page.context().newCDPSession(page);
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.setSamplingInterval", { interval: 100 });
    cdpSessions.set(page, cdp);
  }
  return cdp;
};

const startCpuProfile: BrowserCommand<[]> = async (ctx) => {
  const cdp = await getCdp(ctx);
  await cdp.send("Profiler.start");
};

const setCpuThrottling: BrowserCommand<[rate: number]> = async (ctx, rate) => {
  const cdp = await getCdp(ctx);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
};

/* Same command as the browser tests' (packages/core vitestBrowserTestConfig). */
const setReducedMotion: BrowserCommand<
  [value: "reduce" | "no-preference"]
> = async ({ page }, value) => {
  await page.emulateMedia({ reducedMotion: value });
};

const stopCpuProfile: BrowserCommand<[name: string]> = async (ctx, name) => {
  const cdp = await getCdp(ctx);
  const { profile } = await cdp.send("Profiler.stop");
  const dir = join(dirname(resultsFile), "profiles");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.cpuprofile`), JSON.stringify(profile));
};

/*
 * Performance measurements, not tests: production React in Chromium (or
 * PERF_BROWSER), one file at a time so measurements do not compete for the CPU.
 */
export default mergeConfig(
  defaultConfig,
  defineConfig({
    mode: "production",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    oxc: {
      jsx: { development: false },
    },
    resolve: {
      /*
       * PERF_REACT_PROFILING=1: React's profiling build, so `<Profiler>`
       * reports commits and render durations — at a cost of ~10% (it times
       * every component). Off by default, for the numbers users get.
       */
      alias:
        process.env.PERF_REACT_PROFILING === "1"
          ? [
              {
                find: /^react-dom\/client$/,
                replacement: "react-dom/profiling",
              },
            ]
          : [],
    },
    css: {
      postcss: { plugins: [unlayeredStylesPlugin()] },
    },
    test: {
      css: { include: /.+/ },
      include: ["dev/perf/**/*.perf.tsx"],
      setupFiles: "./dev/perf/setup.ts",
      testTimeout: 600_000,
      hookTimeout: 120_000,
      fileParallelism: false,
      browser: {
        enabled: true,
        headless: true,
        commands: {
          recordPerfResult,
          startCpuProfile,
          stopCpuProfile,
          setCpuThrottling,
          setReducedMotion,
        },
        provider: playwright({
          launchOptions: {
            // `performance.memory` and `gc()`, for the heap figures
            args:
              browser === "chromium"
                ? ["--enable-precise-memory-info", "--js-flags=--expose-gc"]
                : [],
          },
        }),
        instances: [
          {
            browser: browser as "chromium" | "firefox" | "webkit",
            viewport: { width: 1280, height: 900 },
          },
        ],
      },
    },
  }),
);
