import {
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  initialZoomTransform,
  isZoomed,
  panBy,
  type Point,
  zoomTo,
  type ZoomFrame,
  type ZoomTransform,
} from "./lib/zoomTransform";

/** The scale a click, a double tap or Enter zooms to. */
const toggleScale = 2;
const keyboardScaleStep = 0.5;
const keyboardPanStep = 50;
/** Movement in px below which a press still counts as a click or tap. */
const tapTolerance = 4;
const doubleTapDelay = 300;
const doubleTapDistance = 30;
const wheelLineHeight = 16;

type Gesture =
  | { type: "pan"; start: Point; startTransform: ZoomTransform }
  | {
      type: "pinch";
      startDistance: number;
      startMidpoint: Point;
      startTransform: ZoomTransform;
    };

interface Tap {
  time: number;
  point: Point;
}

/** The zoom area is not scaled itself, only its content. */
const frameOf = (element: HTMLElement | null): ZoomFrame => {
  const rect = element?.getBoundingClientRect();
  if (!rect) {
    return {
      width: 0,
      height: 0,
      screen: { left: 0, right: 0, top: 0, bottom: 0 },
    };
  }
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return {
    width: rect.width,
    height: rect.height,
    screen: {
      left: -centerX,
      right: window.innerWidth - centerX,
      top: -centerY,
      bottom: window.innerHeight - centerY,
    },
  };
};

/** Client coordinates as an offset from the center of the zoom area. */
const pointIn = (
  element: HTMLElement | null,
  clientX: number,
  clientY: number,
): Point => {
  const rect = element?.getBoundingClientRect();
  if (!rect) {
    return { x: 0, y: 0 };
  }
  return {
    x: clientX - rect.left - rect.width / 2,
    y: clientY - rect.top - rect.height / 2,
  };
};

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const midpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const useZoom = (
  ref: RefObject<HTMLDivElement | null>,
  maxScale: number,
  isEnabled: boolean,
) => {
  const [transform, setTransform] = useState(initialZoomTransform);
  /* Discrete steps animate, continuous gestures follow the pointer. */
  const [isAnimated, setIsAnimated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  /* Where the zoom area was on screen at the last change. */
  const [frame, setFrame] = useState<ZoomFrame | null>(null);

  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const pressStart = useRef<Point | null>(null);
  const hasMoved = useRef(false);
  /* A press that started while zoomed, or became a pinch, belongs to the zoom:
     a surrounding gallery must not read it as a swipe. */
  const isOwnPress = useRef(false);
  const lastTap = useRef<Tap | null>(null);

  const getFrame = () => frameOf(ref.current);
  const toPoint = (clientX: number, clientY: number) =>
    pointIn(ref.current, clientX, clientY);

  const update = (
    next: (current: ZoomTransform) => ZoomTransform,
    animated: boolean,
  ) => {
    setIsAnimated(animated);
    setFrame(getFrame());
    setTransform(next);
  };

  const toggleAt = (point: Point) =>
    update(
      (current) =>
        isZoomed(current)
          ? initialZoomTransform
          : zoomTo(current, toggleScale, maxScale, getFrame(), point),
      true,
    );

  const zoomBy = (step: number) =>
    update(
      (current) =>
        zoomTo(current, current.scale + step, maxScale, getFrame(), {
          x: 0,
          y: 0,
        }),
      true,
    );

  /* React registers `wheel` as passive, which cannot prevent the scroll. */
  useEffect(() => {
    const element = ref.current;
    if (!element || !isEnabled) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      /* A horizontal trackpad swipe has no zoom direction. */
      if (event.deltaY === 0) {
        return;
      }
      event.preventDefault();

      const deltaY =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * wheelLineHeight
          : event.deltaY;
      /* A trackpad pinch arrives as a wheel event with `ctrlKey` and small
         deltas. */
      const factor = Math.exp(-deltaY * (event.ctrlKey ? 0.01 : 0.002));
      const point = pointIn(element, event.clientX, event.clientY);

      setIsAnimated(false);
      setFrame(frameOf(element));
      setTransform((current) =>
        zoomTo(
          current,
          current.scale * factor,
          maxScale,
          frameOf(element),
          point,
        ),
      );
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, [ref, maxScale, isEnabled]);

  const startGesture = () => {
    const [first, second] = Array.from(pointers.current.values());

    if (first && second) {
      gesture.current = {
        type: "pinch",
        startDistance: distance(first, second),
        startMidpoint: midpoint(first, second),
        startTransform: transform,
      };
    } else if (first && isZoomed(transform)) {
      gesture.current = {
        type: "pan",
        start: first,
        startTransform: transform,
      };
    } else {
      gesture.current = null;
    }

    setIsDragging(gesture.current !== null);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const point = toPoint(event.clientX, event.clientY);
    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 1) {
      pressStart.current = point;
      hasMoved.current = false;
      isOwnPress.current = isZoomed(transform);
    } else {
      isOwnPress.current = true;
      hasMoved.current = true;
    }

    if (isOwnPress.current) {
      event.stopPropagation();
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    startGesture();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) {
      return;
    }

    const point = toPoint(event.clientX, event.clientY);
    pointers.current.set(event.pointerId, point);

    if (
      pressStart.current &&
      distance(pressStart.current, point) > tapTolerance
    ) {
      hasMoved.current = true;
    }

    const current = gesture.current;
    if (!current) {
      return;
    }
    event.stopPropagation();

    if (current.type === "pan") {
      const delta = {
        x: point.x - current.start.x,
        y: point.y - current.start.y,
      };
      update(() => panBy(current.startTransform, delta, getFrame()), false);
      return;
    }

    const [first, second] = Array.from(pointers.current.values());
    if (!first || !second) {
      return;
    }
    const scale =
      (current.startTransform.scale * distance(first, second)) /
      current.startDistance;

    update(
      () =>
        zoomTo(
          current.startTransform,
          scale,
          maxScale,
          getFrame(),
          current.startMidpoint,
          midpoint(first, second),
        ),
      false,
    );
  };

  const handleTap = (event: PointerEvent<HTMLDivElement>, point: Point) => {
    if (event.pointerType !== "touch") {
      toggleAt(point);
      return;
    }

    const now = event.timeStamp;
    const previous = lastTap.current;

    if (
      previous &&
      now - previous.time < doubleTapDelay &&
      distance(previous.point, point) < doubleTapDistance
    ) {
      lastTap.current = null;
      toggleAt(point);
    } else {
      lastTap.current = { time: now, point };
    }
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>, isTap: boolean) => {
    if (!pointers.current.delete(event.pointerId)) {
      return;
    }

    if (isOwnPress.current) {
      event.stopPropagation();
    }

    if (pointers.current.size > 0) {
      /* A pinch that loses a finger goes on as a pan. */
      startGesture();
      return;
    }

    if (isTap && !hasMoved.current) {
      handleTap(event, toPoint(event.clientX, event.clientY));
    }

    gesture.current = null;
    pressStart.current = null;
    setIsDragging(false);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) =>
    endPointer(event, true);

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) =>
    endPointer(event, false);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const pan = (x: number, y: number) => {
      if (!isZoomed(transform)) {
        /* Unzoomed, the arrows are a surrounding gallery's. */
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      update((current) => panBy(current, { x, y }, getFrame()), true);
    };

    switch (event.key) {
      case "+":
      case "=":
        event.preventDefault();
        zoomBy(keyboardScaleStep);
        break;
      case "-":
        event.preventDefault();
        zoomBy(-keyboardScaleStep);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        toggleAt({ x: 0, y: 0 });
        break;
      case "ArrowLeft":
        pan(keyboardPanStep, 0);
        break;
      case "ArrowRight":
        pan(-keyboardPanStep, 0);
        break;
      case "ArrowUp":
        pan(0, keyboardPanStep);
        break;
      case "ArrowDown":
        pan(0, -keyboardPanStep);
        break;
    }
  };

  return {
    transform,
    frame,
    isZoomed: isZoomed(transform),
    isAnimated,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onKeyDown,
    },
  };
};
