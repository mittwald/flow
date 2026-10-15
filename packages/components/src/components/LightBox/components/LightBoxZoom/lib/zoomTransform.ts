export interface ZoomTransform {
  scale: number;
  /** Translation in px, applied after scaling around the center. */
  x: number;
  y: number;
}

/** An offset from the center of the zoom area, in px. */
export interface Point {
  x: number;
  y: number;
}

/**
 * The unscaled size of the zoom area and the edges of the screen around it, as
 * offsets from the area's center.
 */
export interface ZoomFrame {
  width: number;
  height: number;
  screen: { left: number; right: number; top: number; bottom: number };
}

export const initialZoomTransform: ZoomTransform = { scale: 1, x: 0, y: 0 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/*
 * Content larger than the screen covers it, so no edge moves into view. Content
 * smaller than the screen stays inside it.
 */
const clampAxis = (
  offset: number,
  scaledSize: number,
  screenStart: number,
  screenEnd: number,
) => {
  const startAtScreenStart = screenStart + scaledSize / 2;
  const endAtScreenEnd = screenEnd - scaledSize / 2;

  return clamp(
    offset,
    Math.min(startAtScreenStart, endAtScreenEnd),
    Math.max(startAtScreenStart, endAtScreenEnd),
  );
};

export const clampTranslation = (
  transform: ZoomTransform,
  frame: ZoomFrame,
): ZoomTransform => ({
  scale: transform.scale,
  x: clampAxis(
    transform.x,
    frame.width * transform.scale,
    frame.screen.left,
    frame.screen.right,
  ),
  y: clampAxis(
    transform.y,
    frame.height * transform.scale,
    frame.screen.top,
    frame.screen.bottom,
  ),
});

/**
 * Scales to `scale`, keeping the content under `origin` in place. `pointer` is
 * where that content ends up — the same point, unless a pinch moved its
 * midpoint.
 */
export const zoomTo = (
  transform: ZoomTransform,
  scale: number,
  maxScale: number,
  frame: ZoomFrame,
  origin: Point,
  pointer: Point = origin,
): ZoomTransform => {
  const nextScale = clamp(scale, 1, maxScale);

  if (nextScale === 1) {
    return initialZoomTransform;
  }

  const ratio = nextScale / transform.scale;

  return clampTranslation(
    {
      scale: nextScale,
      x: pointer.x - (origin.x - transform.x) * ratio,
      y: pointer.y - (origin.y - transform.y) * ratio,
    },
    frame,
  );
};

export const panBy = (
  transform: ZoomTransform,
  delta: Point,
  frame: ZoomFrame,
): ZoomTransform =>
  isZoomed(transform)
    ? clampTranslation(
        { ...transform, x: transform.x + delta.x, y: transform.y + delta.y },
        frame,
      )
    : transform;

export const isZoomed = (transform: ZoomTransform) => transform.scale > 1;

export interface Area {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The part of the scaled content on screen, from the area's top left corner. */
export const visibleArea = (
  transform: ZoomTransform,
  frame: ZoomFrame,
): Area => {
  const halfWidth = (frame.width * transform.scale) / 2;
  const halfHeight = (frame.height * transform.scale) / 2;

  const left = Math.max(transform.x - halfWidth, frame.screen.left);
  const right = Math.min(transform.x + halfWidth, frame.screen.right);
  const top = Math.max(transform.y - halfHeight, frame.screen.top);
  const bottom = Math.min(transform.y + halfHeight, frame.screen.bottom);

  return {
    left: left + frame.width / 2,
    top: top + frame.height / 2,
    width: right - left,
    height: bottom - top,
  };
};
