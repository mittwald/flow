"use client";
import type { FC } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  LiveEditor,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import styles from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor.module.css";
import { flowTheme } from "@/lib/liveCode/components/LiveCodeEditor/lib/flowTheme";
import extractDefaultExport from "@/lib/liveCode/components/LiveCodeEditor/lib/extractDefaultExport";
import { extractEditorScope } from "@/lib/liveCode/components/LiveCodeEditor/lib/extractEditorScope";
import { codeSteps } from "./codeSteps";
import { useTypedCode } from "./useTypedCode";

const finalCode = codeSteps.at(-1) ?? "";
const scope = extractEditorScope(finalCode);

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The live example of the "Fokus auf Developer Experience" tile: it composes
 * itself step by step, so the nesting and the automatic spacing the tile talks
 * about happen in front of the reader. Stays a fully editable live example
 * afterwards.
 */
const HomeCodeExample: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [reservedHeight, setReservedHeight] = useState<number>();
  const [isVisible, setIsVisible] = useState(false);

  // The example starts out complete: its final height is measured up front and
  // held while the animation runs, so growing code never pushes the page
  // around. The animation itself waits for the tile to be on screen — the tile
  // sits below the fold and watching it compose itself is the whole point.
  useIsomorphicLayoutEffect(() => {
    const element = editorRef.current;

    if (element === null) {
      return;
    }

    setReservedHeight(element.getBoundingClientRect().height);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const { code, isTyping, skip } = useTypedCode(
    codeSteps,
    isVisible && reservedHeight !== undefined,
  );

  const lastPreview = useRef("");

  const transformCode = useCallback((code: string) => {
    try {
      lastPreview.current = extractDefaultExport(code);
    } catch {
      // Half-typed (and half-edited) code keeps the last preview instead of
      // replacing it with a parser error.
    }
    return lastPreview.current;
  }, []);

  return (
    <LiveProvider transformCode={transformCode} code={code} scope={scope}>
      <div
        className={styles.liveCodeEditor}
        ref={editorRef}
        style={isTyping ? { minBlockSize: reservedHeight } : undefined}
      >
        <LivePreview className={styles.preview} />

        <div
          className={styles.editorContainer}
          onFocusCapture={skip}
          onPointerDown={skip}
        >
          <LiveEditor
            tabMode="focus"
            theme={flowTheme}
            className={styles.editor}
          />
        </div>
      </div>
    </LiveProvider>
  );
};

export default HomeCodeExample;
