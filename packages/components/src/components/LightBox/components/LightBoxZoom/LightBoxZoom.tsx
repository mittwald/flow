import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "../../locales/*.locale.json";
import styles from "./LightBoxZoom.module.scss";
import { useZoom } from "./hooks/useZoom";
import { visibleArea } from "./lib/zoomTransform";

export interface LightBoxZoomProps
  extends PropsWithChildren, PropsWithClassName {}

/**
 * Lets a nested zoom switch the surrounding one off: a `LightBox` with
 * `withZoom` wraps its content, and the items of a `LightBoxGallery` in it zoom
 * on their own.
 */
const NestedZoomContext = createContext<(() => () => void) | undefined>(
  undefined,
);

/**
 * The zoomable area of a `LightBox` with `withZoom`. Not a `flowComponent`: it
 * passes the light box's props context through to its children.
 *
 * @flr-generate all
 */
export const LightBoxZoom: FC<LightBoxZoomProps> = (props) => {
  const { children, className } = props;

  const registerWithSurroundingZoom = useContext(NestedZoomContext);
  const [nestedZoomCount, setNestedZoomCount] = useState(0);
  const isEnabled = nestedZoomCount === 0;

  const registerNestedZoom = useCallback(() => {
    setNestedZoomCount((count) => count + 1);
    return () => setNestedZoomCount((count) => count - 1);
  }, []);

  /* Before paint, so the surrounding zoom never shows its own cursor. */
  useLayoutEffect(
    () => registerWithSurroundingZoom?.(),
    [registerWithSurroundingZoom],
  );

  const ref = useRef<HTMLDivElement>(null);
  const { transform, frame, isZoomed, isAnimated, isDragging, handlers } =
    useZoom(ref, isEnabled);
  const descriptionId = useId();

  const stringFormatter = useLocalizedStringFormatter(locales, "LightBox");

  const rootClassName = clsx(
    styles.lightBoxZoom,
    isZoomed && styles.zoomed,
    isDragging && styles.dragging,
    className,
  );

  const contentStyle = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
  };

  /* Zoomed, the ring outlines what is on screen, not the unscaled area. */
  const focusRingStyle =
    isZoomed && frame
      ? { ...visibleArea(transform, frame), right: "auto", bottom: "auto" }
      : undefined;

  /* The same elements as the zoom, so switching does not remount the
     children. */
  const passThrough = (
    <div className={className}>
      <div>{children}</div>
    </div>
  );

  const zoom = (
    <div
      ref={ref}
      className={rootClassName}
      role="group"
      aria-label={stringFormatter.format("zoom")}
      aria-describedby={descriptionId}
      tabIndex={0}
      onDragStart={(event) => event.preventDefault()}
      {...handlers}
    >
      <div
        className={clsx(styles.content, isAnimated && styles.animated)}
        style={contentStyle}
      >
        {children}
      </div>
      <span className={styles.focusRing} style={focusRingStyle} />
      <span id={descriptionId} hidden>
        {stringFormatter.format("zoomDescription")}
      </span>
    </div>
  );

  return (
    <NestedZoomContext value={registerNestedZoom}>
      {isEnabled ? zoom : passThrough}
    </NestedZoomContext>
  );
};

export default LightBoxZoom;
