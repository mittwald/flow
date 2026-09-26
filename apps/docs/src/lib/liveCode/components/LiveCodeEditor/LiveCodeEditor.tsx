import type { CSSProperties, FC, JSX, KeyboardEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import { extractEditorScope } from "@/lib/liveCode/components/LiveCodeEditor/lib/extractEditorScope";
import { transformCode } from "@/lib/liveCode/components/LiveCodeEditor/lib/transformCode";
import styles from "./LiveCodeEditor.module.css";
import clsx from "clsx";
import {
  Button,
  CopyButton,
  Icon,
  LayoutCard,
} from "@mittwald/flow-react-components";
import { IconArrowBarBoth } from "@tabler/icons-react";
import { flowTheme } from "@/lib/liveCode/components/LiveCodeEditor/lib/flowTheme";
import { stripImports } from "@/lib/liveCode/stripImports";

export interface LiveCodeEditorProps {
  code: string | JSX.Element;
  className?: string;
  editorCollapsed?: boolean;
  editorDisabled?: boolean;
  zoom?: number;
  bgColor?: "mstudio" | "dark" | "light" | "darkStatic" | "lightStatic";
  row?: boolean;
  /**
   * Whether the preview gets a handle to drag its width. Use it for examples
   * whose behaviour depends on the container width, such as ColumnLayout's
   * breakpoints.
   */
  resizable?: boolean;
}

/**
 * Number of code lines shown before the example is truncated. Three quarters of
 * the examples are shorter than this, so only the long ones fold.
 */
const truncateLines = 20;

/** Narrowest container the handle can be dragged to. */
const minWidth = 280;
/** Container width a single arrow key press adds or removes. */
const keyStep = 20;

interface Metrics {
  /** Width the preview and the handle share, excluding the track's padding. */
  track: number;
  /** Padding and border the frame draws around the container itself. */
  frame: number;
  /** Width the handle occupies next to the preview. */
  handle: number;
}

// Waiting for https://github.com/FormidableLabs/react-live/issues/339
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const LiveCodeEditor: FC<LiveCodeEditorProps> = (props) => {
  const {
    code,
    className,
    editorCollapsed: editorInitiallyCollapsed,
    editorDisabled,
    zoom = 1,
    bgColor,
    row,
    resizable,
  } = props;

  const [editorCollapsed, setEditorCollapsed] = useState(
    editorInitiallyCollapsed,
  );
  const [codeFolded, setCodeFolded] = useState(true);
  /** The full code height, only while the toggle animates to or from it. */
  const [expandedHeight, setExpandedHeight] = useState<number>();
  const codeRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [draggedWidth, setDraggedWidth] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const editorId = useId();
  const codeId = useId();

  // A new scope identity re-transpiles the example and remounts its preview —
  // expanding the code would reset whatever the reader did in the preview.
  const scope = useMemo(
    () => (typeof code === "string" ? extractEditorScope(code) : {}),
    [code],
  );

  const available = metrics
    ? Math.floor(metrics.track - metrics.frame - metrics.handle)
    : null;
  /**
   * On a narrow screen not even the smallest draggable container fits. Lowering
   * the floor keeps the frame inside the track instead of letting it spill
   * out.
   */
  const floorWidth =
    available === null ? minWidth : Math.max(0, Math.min(minWidth, available));
  /** The widest container the track has room for. */
  const maxWidth = available === null ? null : Math.max(floorWidth, available);
  const containerWidth =
    maxWidth === null
      ? null
      : Math.min(maxWidth, Math.max(floorWidth, draggedWidth ?? maxWidth));

  useEffect(() => {
    const track = trackRef.current;

    if (!resizable || !track) {
      return;
    }

    const measure = () => {
      const frame = track.firstElementChild;
      const handle = track.lastElementChild;

      if (!(frame instanceof HTMLElement) || !(handle instanceof HTMLElement)) {
        return;
      }

      const trackStyle = getComputedStyle(track);
      const frameStyle = getComputedStyle(frame);
      const handleStyle = getComputedStyle(handle);

      const available =
        track.clientWidth -
        parseFloat(trackStyle.paddingLeft) -
        parseFloat(trackStyle.paddingRight);

      // An editor that is not laid out yet — a hidden tab, a collapsed
      // Accordion — would collapse the preview to nothing.
      if (available <= 0) {
        return;
      }

      setMetrics({
        track: available,
        frame:
          parseFloat(frameStyle.paddingLeft) +
          parseFloat(frameStyle.paddingRight) +
          parseFloat(frameStyle.borderLeftWidth) +
          parseFloat(frameStyle.borderRightWidth),
        handle:
          handle.offsetWidth +
          parseFloat(handleStyle.marginLeft) +
          parseFloat(handleStyle.marginRight),
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => observer.disconnect();
  }, [resizable]);

  useEffect(() => {
    if (!isDragging || !metrics || maxWidth === null) {
      return;
    }

    // Listening on the window keeps the drag alive wherever the pointer goes,
    // instead of depending on it staying over the handle.
    const onMove = (event: globalThis.PointerEvent) => {
      const frame = trackRef.current?.firstElementChild;

      if (!frame) {
        return;
      }

      // The pointer drags the frame's right edge; the container is what the
      // frame encloses.
      const width =
        event.clientX - frame.getBoundingClientRect().left - metrics.frame;

      setDraggedWidth(
        Math.min(maxWidth, Math.max(floorWidth, Math.round(width))),
      );
    };

    const stop = () => setIsDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [isDragging, metrics, maxWidth, floorWidth]);

  if (typeof code !== "string") {
    throw new Error("Expected code prop to be of type 'string'.");
  }

  // The scope above already carries the imports, so the editor shows only the
  // example itself.
  const codeToDisplay = stripImports(code).replace(/;$/, "");

  /**
   * The two controls are either-or: an example that starts open is truncated
   * and expands in place, one that starts hidden keeps the show/hide toggle it
   * was given. Stacking both on one example would be two controls for the same
   * code.
   */
  const truncatable =
    codeToDisplay.split("\n").length > truncateLines &&
    !editorInitiallyCollapsed;
  const folded = truncatable && codeFolded;

  /**
   * A height transition needs a length on both ends – `none` does not
   * interpolate. So the full height is measured for the transition and released
   * once it ended, and code that grows while editing is not clipped. Without
   * motion there is no transition to end, so the height is never pinned.
   */
  const toggleFolded = () => {
    const content = codeRef.current?.querySelector("pre");

    if (!content) {
      setCodeFolded(!codeFolded);
      return;
    }

    const animates = getComputedStyle(content)
      .transitionDuration.split(",")
      .some((duration) => parseFloat(duration) > 0);

    if (codeFolded) {
      setExpandedHeight(animates ? content.scrollHeight : undefined);
      setCodeFolded(false);
    } else {
      flushSync(() => setExpandedHeight(content.scrollHeight));
      // Applies the start height before the folded one replaces it.
      content.getBoundingClientRect();
      setCodeFolded(true);
    }
  };

  const showFoldToggle = !editorDisabled && truncatable;
  const showHideToggle = !editorDisabled && !!editorInitiallyCollapsed;

  const resizeTo = (width: number) => {
    if (maxWidth !== null) {
      setDraggedWidth(
        Math.min(maxWidth, Math.max(floorWidth, Math.round(width))),
      );
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (containerWidth === null || maxWidth === null) {
      return;
    }

    const width = {
      ArrowLeft: containerWidth - keyStep,
      ArrowRight: containerWidth + keyStep,
      Home: floorWidth,
      End: maxWidth,
    }[event.key];

    if (width !== undefined) {
      event.preventDefault();
      resizeTo(width);
    }
  };

  /*
   * An inline zoom would beat the stylesheet, so the default is left out
   * entirely — that is what lets the mobile breakpoint scale the preview.
   */
  const zoomStyle = zoom === 1 ? undefined : { zoom };

  const frameStyle: CSSProperties = containerWidth
    ? { ...zoomStyle, boxSizing: "content-box", width: containerWidth }
    : { ...zoomStyle };

  const preview = (
    <LivePreview
      className={clsx(
        styles.preview,
        row && styles.row,
        resizable && styles.framedPreview,
      )}
      style={resizable ? undefined : zoomStyle}
    />
  );

  return (
    <LiveProvider
      code={codeToDisplay}
      scope={scope}
      transformCode={transformCode}
    >
      <div
        className={clsx(
          styles.liveCodeEditor,
          bgColor && styles[`${bgColor}Background`],
          className,
        )}
      >
        {resizable ? (
          <div
            className={clsx(styles.resizeTrack, isDragging && styles.dragging)}
            ref={trackRef}
          >
            <LayoutCard
              className={clsx(
                styles.resizeFrame,
                containerWidth === null && styles.unmeasured,
              )}
              style={frameStyle}
            >
              {preview}
            </LayoutCard>
            <Button
              className={styles.resizeHandle}
              variant="plain"
              color="secondary"
              size="s"
              aria-label={`Breite des Containers${
                containerWidth ? `: ${containerWidth} Pixel` : ""
              }`}
              onPointerDown={() => setIsDragging(true)}
              onKeyDown={onKeyDown}
            >
              <Icon>
                <IconArrowBarBoth />
              </Icon>
            </Button>
          </div>
        ) : (
          preview
        )}

        {!editorDisabled && (
          <div
            className={clsx(
              styles.editorWrapper,
              truncatable && styles.truncatable,
              folded && styles.folded,
            )}
            id={editorId}
            style={
              {
                "--truncated-lines": truncateLines,
                ...(expandedHeight
                  ? { "--expanded-max-height": `${expandedHeight}px` }
                  : {}),
              } as CSSProperties
            }
            onTransitionEnd={(event) => {
              if (event.propertyName === "max-height") {
                setExpandedHeight(undefined);
              }
            }}
          >
            {!editorCollapsed && (
              <>
                <div
                  className={styles.editorContainer}
                  id={codeId}
                  ref={codeRef}
                >
                  <LiveEditor
                    tabMode="focus"
                    theme={flowTheme}
                    className={styles.editor}
                  />
                </div>
                <CopyButton
                  className={styles.copyButton}
                  size="s"
                  variant="soft"
                  text={codeToDisplay}
                />
                {showFoldToggle && (
                  <div className={styles.foldToggle}>
                    <Button
                      size="s"
                      variant="plain"
                      color="secondary"
                      onPress={toggleFolded}
                      aria-expanded={!folded}
                      aria-controls={codeId}
                    >
                      {folded ? <>Mehr anzeigen</> : <>Weniger anzeigen</>}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {showHideToggle && (
          <div className={styles.actions}>
            <Button
              className={styles.toggleCode}
              size="s"
              variant="plain"
              color="secondary"
              onPress={() => setEditorCollapsed(!editorCollapsed)}
              aria-expanded={!editorCollapsed}
              aria-controls={editorId}
            >
              {editorCollapsed ? <>Code anzeigen</> : <>Code ausblenden</>}
            </Button>
          </div>
        )}

        <LiveError />
      </div>
    </LiveProvider>
  );
};

export default LiveCodeEditor;
