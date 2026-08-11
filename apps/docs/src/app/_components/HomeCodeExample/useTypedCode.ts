"use client";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const charDelay = 16;
const lineDelay = 60;
const stepDelay = 400;

interface Insertion {
  at: number;
  text: string;
}

interface Frame {
  code: string;
  delay: number;
}

interface TypedCode {
  code: string;
  isTyping: boolean;
  skip: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const insertsWholeLines = (text: string): boolean =>
  text.startsWith("\n") && !text.endsWith("\n");

/**
 * An insertion can be described at several positions — inserting `b\na` before
 * an `a` equals inserting `a\nb` after it. Picking the whole-line description
 * types a new block on its own line instead of growing it out of the next one.
 */
const preferWholeLines = (from: string, insertion: Insertion): Insertion => {
  let shifted = insertion;

  while (
    !insertsWholeLines(shifted.text) &&
    shifted.at > 0 &&
    from[shifted.at - 1] === shifted.text.at(-1)
  ) {
    shifted = {
      at: shifted.at - 1,
      text: `${shifted.text.at(-1)}${shifted.text.slice(0, -1)}`,
    };
  }

  return insertsWholeLines(shifted.text) ? shifted : insertion;
};

const getInsertion = (from: string, to: string): Insertion | undefined => {
  if (to.length <= from.length) {
    return undefined;
  }

  let at = 0;
  while (at < from.length && from[at] === to[at]) {
    at++;
  }

  let suffixLength = 0;
  while (
    suffixLength < from.length - at &&
    from[from.length - 1 - suffixLength] === to[to.length - 1 - suffixLength]
  ) {
    suffixLength++;
  }

  if (at + suffixLength !== from.length) {
    return undefined;
  }

  return preferWholeLines(from, {
    at,
    text: to.slice(at, to.length - suffixLength),
  });
};

const buildFrames = (steps: string[]): Frame[] => {
  const [firstStep, ...nextSteps] = steps;

  if (firstStep === undefined) {
    return [];
  }

  const frames: Frame[] = [{ code: firstStep, delay: 0 }];
  let previousStep = firstStep;

  for (const step of nextSteps) {
    const insertion = getInsertion(previousStep, step);

    if (insertion === undefined) {
      frames.push({ code: step, delay: stepDelay });
    } else {
      const prefix = previousStep.slice(0, insertion.at);
      const suffix = previousStep.slice(insertion.at);

      for (let length = 1; length <= insertion.text.length; length++) {
        const typed = insertion.text.slice(0, length);
        frames.push({
          code: `${prefix}${typed}${suffix}`,
          delay:
            length === 1
              ? stepDelay
              : typed.endsWith("\n")
                ? lineDelay
                : charDelay,
        });
      }
    }

    previousStep = step;
  }

  return frames;
};

export const useTypedCode = (steps: string[], enabled: boolean): TypedCode => {
  const finalCode = steps.at(-1) ?? "";

  const [code, setCode] = useState(finalCode);
  const [isFinished, setIsFinished] = useState(false);

  const skip = useCallback(() => setIsFinished(true), []);

  useIsomorphicLayoutEffect(() => {
    if (!enabled || isFinished) {
      return;
    }

    if (prefersReducedMotion()) {
      setIsFinished(true);
      return;
    }

    const frames = buildFrames(steps);
    const [firstFrame] = frames;

    if (firstFrame === undefined) {
      setIsFinished(true);
      return;
    }

    // Synchronously, and from a layout effect: the state this replaces is the
    // finished example, so anything that lands after the first paint — a plain
    // effect, or leaving the first frame to the timer — flashes it.
    setCode(firstFrame.code);

    let timeout: ReturnType<typeof setTimeout>;
    let index = 1;

    const scheduleNextFrame = () => {
      const frame = frames[index];

      if (frame === undefined) {
        setIsFinished(true);
        return;
      }

      timeout = setTimeout(() => {
        setCode(frame.code);
        index++;
        scheduleNextFrame();
      }, frame.delay);
    };

    scheduleNextFrame();

    return () => clearTimeout(timeout);
  }, [steps, enabled, isFinished]);

  return {
    code: isFinished ? finalCode : code,
    isTyping: enabled && !isFinished,
    skip,
  };
};
