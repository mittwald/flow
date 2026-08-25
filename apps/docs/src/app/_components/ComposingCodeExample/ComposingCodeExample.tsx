"use client";
import {
  LiveEditor,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import clsx from "clsx";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import codeStyles from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor.module.css";
import extractDefaultExport from "@/lib/liveCode/components/LiveCodeEditor/lib/extractDefaultExport";
import { extractEditorScope } from "@/lib/liveCode/components/LiveCodeEditor/lib/extractEditorScope";
import { flowTheme } from "@/lib/liveCode/components/LiveCodeEditor/lib/flowTheme";
import { buildAnimation } from "./buildFrames";
import { composingCodeExamples, exampleImports } from "./steps";
import styles from "./ComposingCodeExample.module.scss";

const { frames, restingIndex } = buildAnimation(composingCodeExamples);
const lastFrameIndex = frames.length - 1;

/** The frame the given one runs into when the animation is cut short. */
const endOfExample = (index: number) => {
  for (let candidate = index; candidate <= lastFrameIndex; candidate++) {
    if (frames[candidate]?.isExampleEnd) {
      return candidate;
    }
  }
  return lastFrameIndex;
};

// Stable identities: `LiveProvider` re-transpiles whenever `scope` or
// `transformCode` change identity, which would loop endlessly on re-render.
const transformCode = (code: string) => {
  try {
    return extractDefaultExport(code);
  } catch (error) {
    return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
  }
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

interface Props {
  className?: string;
}

/**
 * The homepage example that assembles itself, cycling through the examples in
 * `steps.ts`: loose components, rendered one below the other in the order they
 * are written, are nested step by step until Flow arranges them on its own.
 *
 * The first example, finished, is what renders on the server and for anyone who
 * prefers reduced motion. Otherwise the build-up rewinds after hydration and
 * runs whenever the tile is on screen. Interacting with the editor completes
 * the current example and ends the loop, so the example stays freely editable.
 */
export const ComposingCodeExample: FC<Props> = (props) => {
  const { className } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);
  const [frameIndex, setFrameIndex] = useState(restingIndex);
  const [isArmed, setIsArmed] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [editedCode, setEditedCode] = useState<string>();

  const frame = frames[frameIndex] ?? frames[restingIndex];
  const editorCode = frame?.editorCode ?? "";
  const previewCode = editedCode ?? frame?.previewCode ?? "";
  const frameDelay = frame?.delay ?? 0;

  const scope = useMemo(() => extractEditorScope(exampleImports), []);

  const stop = useCallback(() => {
    setIsArmed(false);
    setFrameIndex(endOfExample);
  }, []);

  const skipToEnd = useCallback(() => {
    hasInteracted.current = true;
    stop();
  }, [stop]);

  // Rewind to the first step only after hydration, so a finished example is
  // what gets server rendered. Reduced motion keeps it that way — including
  // when the setting is flipped while the page is open.
  useEffect(() => {
    const query = window.matchMedia(reducedMotionQuery);

    const sync = () => {
      if (query.matches) {
        stop();
      } else if (!hasInteracted.current) {
        setFrameIndex(0);
        setIsArmed(true);
      }
    };

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, [stop]);

  // Nothing animates off screen — the build-up pauses and picks up again when
  // the tile scrolls back in.
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isArmed || !isOnScreen) {
      return;
    }

    const timeout = setTimeout(
      () => setFrameIndex((index) => (index >= lastFrameIndex ? 0 : index + 1)),
      frameDelay,
    );

    return () => clearTimeout(timeout);
  }, [isArmed, isOnScreen, frameIndex, frameDelay]);

  const handleEditorChange = (code: string) => {
    // The editor also reports back the code we typed into it ourselves.
    if (code === editorCode) {
      return;
    }
    hasInteracted.current = true;
    setIsArmed(false);
    setEditedCode(code);
  };

  return (
    <LiveProvider
      transformCode={transformCode}
      code={previewCode}
      scope={scope}
    >
      <div
        ref={containerRef}
        className={clsx(codeStyles.liveCodeEditor, styles.example, className)}
        onPointerDown={skipToEnd}
        onFocus={skipToEnd}
      >
        <LivePreview className={clsx(codeStyles.preview, styles.preview)} />

        <div
          className={clsx(codeStyles.editorContainer, styles.editorContainer)}
        >
          <LiveEditor
            tabMode="focus"
            theme={flowTheme}
            className={clsx(codeStyles.editor, styles.codeEditor)}
            code={editorCode}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </LiveProvider>
  );
};

export default ComposingCodeExample;
