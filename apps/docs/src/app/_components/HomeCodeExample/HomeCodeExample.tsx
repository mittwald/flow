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
import { codeSteps, scopeSource } from "./codeSteps";
import { useTypedCode } from "./useTypedCode";

const scope = extractEditorScope(scopeSource);

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface ReservedHeights {
  preview: number;
  editor: number;
}

/**
 * Heights of the finished example. Preview and code block each hold their own,
 * so nothing inside the tile moves while the code is typed — a single height on
 * the wrapper would keep the page still, but the preview would still drift as
 * the code block grows underneath it.
 *
 * Neither element takes a ref (both come from react-live), hence the lookup by
 * class name.
 */
const measure = (wrapper: HTMLElement): ReservedHeights | undefined => {
  const preview = wrapper.querySelector(`.${styles.preview}`);
  const editor = wrapper.querySelector(`.${styles.editor}`);

  if (preview === null || editor === null) {
    return undefined;
  }

  return {
    preview: preview.getBoundingClientRect().height,
    editor: editor.getBoundingClientRect().height,
  };
};

/**
 * The live example of the "Fokus auf Developer Experience" tile: it composes
 * itself step by step, so the nesting and the automatic spacing the tile talks
 * about happen in front of the reader. Stays a fully editable live example
 * afterwards.
 */
const HomeCodeExample: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reserved, setReserved] = useState<ReservedHeights>();
  const [isVisible, setIsVisible] = useState(false);

  // The example starts out complete, which is what makes it measurable. The
  // animation itself waits for the tile to be on screen — the tile sits below
  // the fold and watching it compose itself is the whole point.
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper === null) {
      return;
    }

    setReserved(measure(wrapper));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  const { code, isTyping, skip } = useTypedCode(
    codeSteps,
    isVisible && reserved !== undefined,
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
      <div className={styles.liveCodeEditor} ref={wrapperRef}>
        <LivePreview
          className={styles.preview}
          style={
            isTyping
              ? // Top aligned, or the composition would drift upwards inside
                // the reserved space as it grows.
                { minBlockSize: reserved?.preview, justifyContent: "start" }
              : undefined
          }
        />

        <div
          className={styles.editorContainer}
          onFocusCapture={skip}
          onPointerDown={skip}
        >
          <LiveEditor
            tabMode="focus"
            theme={flowTheme}
            className={styles.editor}
            style={isTyping ? { minBlockSize: reserved?.editor } : undefined}
          />
        </div>
      </div>
    </LiveProvider>
  );
};

export default HomeCodeExample;
