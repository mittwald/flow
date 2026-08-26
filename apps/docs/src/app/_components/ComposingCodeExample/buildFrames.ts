export interface AnimationFrame {
  /** Code shown in the editor — the last line may still be half typed. */
  editorCode: string;
  /** Last code that was complete and parseable; what the preview renders. */
  previewCode: string;
  /** How long this frame stays on screen. */
  delay: number;
  /** Whether this frame completes an example. */
  isExampleEnd: boolean;
}

export interface Animation {
  frames: AnimationFrame[];
  /** The frame to rest on when nothing animates: the first example, finished. */
  restingIndex: number;
}

/** Delay between two typed characters. */
const typeDelay = 16;
/** Pause after a finished line. */
const linePause = 240;
/** Pause after a finished composition step, so the preview can be read. */
const stepPause = 1400;
/** Pause on a finished example before the next one starts. */
const examplePause = 5_000;

const isDefined = (value: string | undefined): value is string =>
  value !== undefined;

const countLines = (code: string) => code.split("\n").length;

/**
 * Expands the composition steps of every example into the frames of the
 * build-up animation, played back as one loop.
 *
 * Per step transition every line carried over from the previous step snaps into
 * its new place at once — only new lines are typed out, character by character,
 * in source order. The preview lags behind by design: it keeps rendering the
 * previous (complete) step until the current one is fully typed, so it never
 * has to render half-written JSX.
 *
 * Every frame is padded with blank lines to the length of the longest step of
 * any example, so the editor keeps one height for the whole loop and neither
 * the tile nor the page below it ever jumps.
 */
export const buildAnimation = (examples: string[][]): Animation => {
  const steps = examples.flat();
  const maxLines = Math.max(1, ...steps.map(countLines));
  const padToMaxLines = (code: string) =>
    code + "\n".repeat(Math.max(0, maxLines - countLines(code)));

  const frames: AnimationFrame[] = [];

  for (const example of examples) {
    const [firstStep, ...nextSteps] = example;

    if (firstStep === undefined) {
      continue;
    }

    let previewCode = firstStep;
    let previousStep = firstStep;

    frames.push({
      editorCode: padToMaxLines(firstStep),
      previewCode,
      delay: stepPause,
      isExampleEnd: false,
    });

    for (const step of nextSteps) {
      const carriedLines = new Set(
        previousStep
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      );

      const lines = step.split("\n");
      const visibleLines = lines.map((line) =>
        carriedLines.has(line.trim()) ? line : undefined,
      );

      const pushFrame = (delay: number) =>
        frames.push({
          editorCode: padToMaxLines(visibleLines.filter(isDefined).join("\n")),
          previewCode,
          delay,
          isExampleEnd: false,
        });

      pushFrame(linePause);

      lines.forEach((line, index) => {
        if (visibleLines[index] !== undefined) {
          return;
        }

        // Indentation appears at once — typing invisible spaces looks stalled,
        // and a frame showing nothing but an empty line reads as a glitch.
        const indentation = line.length - line.trimStart().length;
        const start = line.length === 0 ? 0 : Math.max(indentation, 1);

        for (let length = start; length <= line.length; length++) {
          visibleLines[index] = line.slice(0, length);
          pushFrame(length === line.length ? linePause : typeDelay);
        }
      });

      previewCode = step;
      previousStep = step;

      const stepEnd = frames.at(-1);
      if (stepEnd) {
        stepEnd.previewCode = previewCode;
        stepEnd.delay = stepPause;
      }
    }

    const exampleEnd = frames.at(-1);
    if (exampleEnd) {
      exampleEnd.delay = examplePause;
      exampleEnd.isExampleEnd = true;
    }
  }

  return {
    frames,
    restingIndex: Math.max(
      0,
      frames.findIndex((frame) => frame.isExampleEnd),
    ),
  };
};
