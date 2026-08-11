import type { ErrorPayload, Plugin, ViteDevServer } from "vite";
import { spawn } from "child_process";
import { createRequire } from "module";
import path from "path";
import process from "process";

/**
 * A Vite plugin that type-checks the project with the native TypeScript
 * compiler (`tsc` from `@typescript/native`, i.e. the Go-based TypeScript 7)
 * and surfaces the current errors in the terminal and the browser error
 * overlay.
 *
 * It is a lightweight alternative to `vite-plugin-checker`: instead of a
 * long-lived, memory-hungry worker, it runs a fast one-shot native check
 * (debounced) whenever a TypeScript file changes.
 *
 * Wire it up in `.storybook/main.ts`:
 *
 * ```ts
 * viteFinal: (config) =>
 *   mergeConfig(config, { plugins: [typescriptCheckerPlugin()] }),
 * ```
 */
export interface TypescriptCheckerOptions {
  /**
   * Path to the tsconfig, relative to the Vite root (the package directory).
   *
   * @default "tsconfig.json"
   */
  tsconfigPath?: string;
  /**
   * Show errors in the browser error overlay in addition to the terminal.
   *
   * @default true
   */
  overlay?: boolean;
  /**
   * Debounce between a file change and the re-check, in milliseconds.
   *
   * @default 300
   */
  debounce?: number;
  /**
   * Explicit path to the native TypeScript compiler binary. By default it is
   * resolved from the installed `@typescript/native` package (the `tsc` bin),
   * falling back to `tsc` on the `PATH`.
   */
  bin?: string;
}

export interface TsDiagnostic {
  /** Absolute path to the file. */
  file: string;
  line: number;
  column: number;
  /** The diagnostic code, e.g. `"TS2322"`. */
  code: string;
  message: string;
}

const DIAGNOSTIC_RE =
  /^(?<file>.+?)\((?<line>\d+),(?<column>\d+)\): error (?<code>TS\d+): (?<message>.*)$/;

/**
 * Parse `tsc --pretty false` stdout into structured diagnostics.
 *
 * Pure and side-effect free so it can be unit tested without spawning `tsc`.
 * Non-diagnostic lines (summaries, blank lines, unrelated noise) are ignored.
 */
export const parseTypescriptOutput = (
  output: string,
  root: string,
): TsDiagnostic[] => {
  const diagnostics: TsDiagnostic[] = [];
  for (const rawLine of output.split(/\r?\n/)) {
    const groups = DIAGNOSTIC_RE.exec(rawLine.trimEnd())?.groups;
    if (!groups) {
      continue;
    }
    const { file, line, column, code, message } = groups;
    if (
      file === undefined ||
      line === undefined ||
      column === undefined ||
      code === undefined ||
      message === undefined
    ) {
      continue;
    }
    diagnostics.push({
      file: path.resolve(root, file),
      line: Number(line),
      column: Number(column),
      code,
      message,
    });
  }
  return diagnostics;
};

interface ResolvedBin {
  command: string;
  prefixArgs: string[];
}

const resolveTypescriptBin = (root: string, explicit?: string): ResolvedBin => {
  if (explicit) {
    return { command: explicit, prefixArgs: [] };
  }
  try {
    const require = createRequire(path.join(root, "__typescript_resolve__.js"));
    const pkgJsonPath = require.resolve("@typescript/native/package.json");
    const pkg = require("@typescript/native/package.json") as {
      bin?: string | Record<string, string>;
    };
    const binRelative = typeof pkg.bin === "string" ? pkg.bin : pkg.bin?.tsc;
    if (binRelative) {
      const binAbsolute = path.resolve(path.dirname(pkgJsonPath), binRelative);
      // The native tsc bin is a Node launcher (`#!/usr/bin/env node`); run via node.
      return { command: process.execPath, prefixArgs: [binAbsolute] };
    }
  } catch {
    // fall through to a PATH lookup
  }
  return { command: "tsc", prefixArgs: [] };
};

interface TypescriptRunResult {
  diagnostics: TsDiagnostic[];
  spawnError?: string;
}

const runTypescript = (
  { command, prefixArgs }: ResolvedBin,
  tsconfigPath: string,
  root: string,
): Promise<TypescriptRunResult> =>
  new Promise((resolve) => {
    const child = spawn(
      command,
      [
        ...prefixArgs,
        "--noEmit",
        "--pretty",
        "false",
        "--project",
        tsconfigPath,
      ],
      { cwd: root },
    );
    let output = "";
    let spawnError: string | undefined;
    child.stdout?.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.stderr?.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.on("error", (error: Error) => (spawnError = error.message));
    child.on("close", () =>
      resolve({ diagnostics: parseTypescriptOutput(output, root), spawnError }),
    );
  });

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const pluralErrors = (count: number): string =>
  `${count} type error${count === 1 ? "" : "s"}`;

const logDiagnostics = (
  server: ViteDevServer,
  diagnostics: TsDiagnostic[],
): void => {
  const { logger, root } = server.config;
  const body = diagnostics
    .map((diagnostic) => {
      const location = `${path.relative(root, diagnostic.file)}:${diagnostic.line}:${diagnostic.column}`;
      return `  ${location} ${DIM}${diagnostic.code}${RESET} ${diagnostic.message}`;
    })
    .join("\n");
  logger.error(
    `${RED}✗ [typescript] ${pluralErrors(diagnostics.length)}${RESET}\n${body}`,
    {
      timestamp: true,
    },
  );
};

const toOverlayError = (
  diagnostics: TsDiagnostic[],
  root: string,
): ErrorPayload["err"] => {
  const body = diagnostics
    .map((diagnostic) => {
      const location = `${path.relative(root, diagnostic.file)}(${diagnostic.line},${diagnostic.column})`;
      return `${location}\n  ${diagnostic.code}: ${diagnostic.message}`;
    })
    .join("\n\n");
  const [first] = diagnostics;
  return {
    message: `${pluralErrors(diagnostics.length)} (typescript)\n\n${body}`,
    stack: "",
    plugin: "typescript-checker",
    id: first?.file,
    loc: first
      ? { file: first.file, line: first.line, column: first.column }
      : undefined,
  };
};

export const typescriptCheckerPlugin = (
  options: TypescriptCheckerOptions = {},
): Plugin => {
  const {
    tsconfigPath = "tsconfig.json",
    overlay = true,
    debounce = 300,
    bin,
  } = options;

  let server: ViteDevServer;
  let resolvedBin: ResolvedBin;
  let running = false;
  let rerunQueued = false;
  let missingBinWarned = false;
  // -1 = has not run yet; otherwise the error count of the previous run.
  let previousCount = -1;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const check = async (): Promise<void> => {
    if (disposed) {
      return;
    }
    if (running) {
      rerunQueued = true;
      return;
    }
    running = true;
    const { diagnostics, spawnError } = await runTypescript(
      resolvedBin,
      tsconfigPath,
      server.config.root,
    );

    // The server may have closed during the (async) typescript run — don't touch it.
    if (disposed) {
      running = false;
      return;
    }

    if (spawnError) {
      if (!missingBinWarned) {
        missingBinWarned = true;
        server.config.logger.warn(
          `${RED}[typescript] could not run the native compiler (${spawnError}).${RESET} ` +
            `Install it with: pnpm add -D @typescript/native@npm:typescript@^7.0.2`,
          { timestamp: true },
        );
      }
    } else {
      if (diagnostics.length > 0) {
        logDiagnostics(server, diagnostics);
        if (overlay) {
          server.ws.send({
            type: "error",
            err: toOverlayError(diagnostics, server.config.root),
          });
        }
      } else {
        if (previousCount > 0 && overlay) {
          // We just went from errors to none: dismiss the stale overlay. An
          // empty update makes Vite's client call clearErrorOverlay().
          server.ws.send({ type: "update", updates: [] });
        }
        if (previousCount !== 0) {
          // Announce success on the first run or after clearing errors, so a
          // stream of green edits does not spam the terminal.
          server.config.logger.info(
            `${GREEN}✓ [typescript] no type errors${RESET}`,
            {
              timestamp: true,
            },
          );
        }
      }
      previousCount = diagnostics.length;
    }

    running = false;
    if (rerunQueued) {
      rerunQueued = false;
      void check();
    }
  };

  const scheduleCheck = (): void => {
    if (disposed) {
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => void check(), debounce);
  };

  return {
    name: "vite-plugin-typescript-checker",
    apply: "serve",
    configureServer(devServer) {
      server = devServer;
      resolvedBin = resolveTypescriptBin(devServer.config.root, bin);

      const onChange = (file: string): void => {
        if (
          /\.(?:tsx?|mts|cts)$/.test(file) &&
          !file.includes("node_modules")
        ) {
          scheduleCheck();
        }
      };
      devServer.watcher.on("change", onChange);
      devServer.watcher.on("add", onChange);
      devServer.watcher.on("unlink", onChange);

      // On reconnect (e.g. a page reload) re-run the check so the overlay
      // reflects the current state instead of a stale error. The first
      // connection is already covered by the initial check below.
      let hasConnected = false;
      const onConnection = (): void => {
        if (hasConnected) {
          scheduleCheck();
        }
        hasConnected = true;
      };
      devServer.ws.on("connection", onConnection);

      // Remove our listeners and cancel pending work when the server closes —
      // e.g. a Storybook / watch-mode restart in the same process — so handlers
      // and timers don't accumulate across restarts. Vite has no first-class
      // dev-teardown hook that also fires in middleware mode (Storybook has no
      // httpServer), so we wrap `close`, which always runs on shutdown/restart.
      const originalClose = devServer.close.bind(devServer);
      devServer.close = async () => {
        disposed = true;
        if (timer) {
          clearTimeout(timer);
        }
        devServer.watcher.off("change", onChange);
        devServer.watcher.off("add", onChange);
        devServer.watcher.off("unlink", onChange);
        devServer.ws.off("connection", onConnection);
        return originalClose();
      };

      // Kick off the initial check without blocking server startup.
      void check();
    },
  };
};
