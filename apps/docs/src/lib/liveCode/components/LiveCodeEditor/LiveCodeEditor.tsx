import type {
  CSSProperties,
  FC,
  JSX,
  KeyboardEvent,
  PointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import { extractEditorScope } from "@/lib/liveCode/components/LiveCodeEditor/lib/extractEditorScope";
import extractDefaultExport from "@/lib/liveCode/components/LiveCodeEditor/lib/extractDefaultExport";
import styles from "./LiveCodeEditor.module.css";
import * as EditorComponents from "./components";
import clsx from "clsx";
import { Button } from "@mittwald/flow-react-components";
import { IconArrowBarBoth } from "@tabler/icons-react";
import { flowTheme } from "@/lib/liveCode/components/LiveCodeEditor/lib/flowTheme";

export interface LiveCodeEditorProps {
  code: string | JSX.Element;
  className?: string;
  editorCollapsed?: boolean;
  editorDisabled?: boolean;
  zoom?: number;
  bgColor?: "mstudio" | "dark" | "light" | "darkStatic" | "lightStatic";
  mobile?: boolean;
  row?: boolean;
  /**
   * Whether the preview gets a handle to drag its width. Use it for examples
   * whose behaviour depends on the container width, such as ColumnLayout's
   * breakpoints.
   */
  resizable?: boolean;
}

/** Narrowest container the handle can be dragged to. */
const minWidth = 280;
/** Container width a single arrow key press adds or removes. */
const keyStep = 20;

interface Metrics {
  /** Width the preview and the handle share, excluding the track's padding. */
  track: number;
  /** Padding and border the preview draws around the container itself. */
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
    mobile,
    row,
    resizable,
  } = props;

  const [editorCollapsed, setEditorCollapsed] = useState(
    editorInitiallyCollapsed,
  );
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [draggedWidth, setDraggedWidth] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;

    if (!resizable || !track) {
      return;
    }

    const measure = () => {
      const preview = track.firstElementChild;
      const handle = track.lastElementChild;

      if (
        !(preview instanceof HTMLElement) ||
        !(handle instanceof HTMLElement)
      ) {
        return;
      }

      const trackStyle = getComputedStyle(track);
      const previewStyle = getComputedStyle(preview);
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
          parseFloat(previewStyle.paddingLeft) +
          parseFloat(previewStyle.paddingRight) +
          parseFloat(previewStyle.borderLeftWidth) +
          parseFloat(previewStyle.borderRightWidth),
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

  if (typeof code !== "string") {
    throw new Error("Expected code prop to be of type 'string'.");
  }

  const scope = extractEditorScope(code);

  const transformCode = (code: string) => {
    try {
      return extractDefaultExport(code);
    } catch (error) {
      return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
    }
  };

  const codeToDisplay = code.replace(/;\r?\n$/, "");

  /** The widest container the track has room for. */
  const maxWidth = metrics
    ? Math.max(minWidth, metrics.track - metrics.frame - metrics.handle)
    : null;
  const containerWidth =
    maxWidth === null
      ? null
      : Math.min(maxWidth, Math.max(minWidth, draggedWidth ?? maxWidth));

  const resizeTo = (width: number) => {
    if (maxWidth !== null) {
      setDraggedWidth(
        Math.min(maxWidth, Math.max(minWidth, Math.round(width))),
      );
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = true;
    // Keeps the moves coming while the pointer leaves the narrow handle.
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const preview = trackRef.current?.firstElementChild;

    if (!draggingRef.current || !preview || !metrics) {
      return;
    }

    // The pointer drags the frame's right edge; the container is what the frame
    // encloses.
    resizeTo(
      event.clientX - preview.getBoundingClientRect().left - metrics.frame,
    );
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (containerWidth === null || maxWidth === null) {
      return;
    }

    const width = {
      ArrowLeft: containerWidth - keyStep,
      ArrowRight: containerWidth + keyStep,
      Home: minWidth,
      End: maxWidth,
    }[event.key];

    if (width !== undefined) {
      event.preventDefault();
      resizeTo(width);
    }
  };

  const previewStyle: CSSProperties =
    resizable && containerWidth
      ? { zoom, boxSizing: "content-box", width: containerWidth }
      : { zoom };

  const preview = (
    <LivePreview
      className={clsx(
        styles.preview,
        row && styles.row,
        resizable && containerWidth === null && styles.unmeasured,
      )}
      style={previewStyle}
    />
  );

  return (
    <LiveProvider
      code={codeToDisplay}
      scope={{
        ...scope,
        ...EditorComponents,
      }}
      transformCode={transformCode}
    >
      <div
        className={clsx(
          styles.liveCodeEditor,
          bgColor && styles[`${bgColor}Background`],
          mobile && styles.mobile,
          className,
        )}
      >
        {resizable ? (
          <div className={styles.resizeTrack} ref={trackRef}>
            {preview}
            <Button
              className={styles.resizeHandle}
              variant="plain"
              color="secondary"
              size="s"
              aria-label={`Breite des Containers${
                containerWidth ? `: ${containerWidth} Pixel` : ""
              }`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
            >
              <IconArrowBarBoth size={20} aria-hidden />
            </Button>
          </div>
        ) : (
          preview
        )}

        {!editorDisabled && (
          <div className={styles.editorContainer}>
            {!editorCollapsed && (
              <LiveEditor
                tabMode="focus"
                theme={flowTheme}
                className={styles.editor}
              />
            )}
          </div>
        )}

        {!editorDisabled && (
          <div className={styles.actions}>
            <Button
              className={styles.toggleCode}
              size="s"
              variant="plain"
              color="secondary"
              onPress={() => setEditorCollapsed(!editorCollapsed)}
            >
              {editorCollapsed ? <>Code anzeigen</> : <>Code ausblenden</>}
            </Button>
          </div>
        )}

        <LiveError className={styles.error} />
      </div>
    </LiveProvider>
  );
};

export default LiveCodeEditor;
