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
 * Preview and code block are measured apart: a single height on the wrapper
 * keeps the page still, but the preview keeps drifting as the code block grows
 * underneath it. Neither takes a ref, hence the lookup by class name.
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

const HomeCodeExample: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reserved, setReserved] = useState<ReservedHeights>();
  const [isVisible, setIsVisible] = useState(false);

  // Measuring here works because useTypedCode starts out on the last step. The
  // animation waits for the tile, which sits below the fold, to be on screen.
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
      // Half-typed code does not parse, which is most frames of the
      // animation. Holding the last preview beats flashing a parser error.
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
              ? // The shared stylesheet centres the preview, which would drift
                // the composition upwards inside the reserved height.
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
