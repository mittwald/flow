/**
 * Terminal text helpers shared by the renderers in this directory.
 *
 * They live here rather than in `list.ts` because `peers.ts` needs them too,
 * and `list.ts` imports `peers.ts` to render its own peer section — keeping
 * them there would make that pair circular.
 */
import colors from "picocolors";

/**
 * A palette key from `painter()` — see the `tone` field on `actions` in
 * `list.ts`.
 */
export type Tone = "green" | "yellow" | "blue";

/**
 * ANSI escapes have no width; measuring must ignore them.
 *
 * Built from a char code rather than written as a literal, so no control
 * character sits in the source — which is also what `no-control-regex` wants.
 */
const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
export const stripAnsi = (text: string): string => text.replace(ansi, "");
const visibleWidth = (text: string): number => stripAnsi(text).length;

/**
 * Wraps to `width`, measuring visible width so already-coloured text still
 * breaks in the right place.
 */
export const wrap = (text: string, width: number): string[] => {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/).filter((part) => part !== "")) {
    if (line === "") {
      line = word;
    } else if (visibleWidth(line) + 1 + visibleWidth(word) <= width) {
      line = `${line} ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line !== "") {
    lines.push(line);
  }

  return lines.length > 0 ? lines : [""];
};

export interface Painter extends Record<Tone, (text: string) => string> {
  bold: (text: string) => string;
  dim: (text: string) => string;
  code: (text: string) => string;
}

/**
 * Builds a palette from `color`, and only from `color`.
 *
 * `colors` (the module-level `picocolors` default export) auto-detects a TTY
 * and disables itself under one — reading `colors.green` etc. directly would
 * make the _environment_, not this argument, the real decider, silently
 * disagreeing with `cli.ts`'s own TTY/`NO_COLOR`/`--json` check. `createColors`
 * returns a palette with colour forced on or off, so `color` is the only input
 * to how this renders.
 */
export const painter = (color: boolean): Painter => {
  const palette = colors.createColors(color);
  return {
    bold: palette.bold,
    dim: palette.dim,
    code: palette.cyan,
    green: palette.green,
    yellow: palette.yellow,
    blue: palette.blue,
  };
};
