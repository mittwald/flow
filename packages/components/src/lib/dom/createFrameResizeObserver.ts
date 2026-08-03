export interface FrameResizeObserver {
  /**
   * (Re-)observe exactly the given targets. Any previously observed element is
   * dropped first, so this can be called repeatedly with a changed target set.
   */
  observe: (targets: Iterable<Element>) => void;
  /**
   * Queue a measurement on the next animation frame. Repeated calls before the
   * frame runs coalesce into a single measurement.
   */
  schedule: () => void;
  /** Stop observing and cancel any queued measurement. */
  disconnect: () => void;
}

/**
 * Wraps a `ResizeObserver` whose measurements are deferred to the next
 * animation frame. Deferring serves two purposes: it coalesces bursts of resize
 * notifications into a single measurement, and it avoids "ResizeObserver loop"
 * errors when the measurement itself mutates the layout of observed elements.
 *
 * Lifecycle (creating the observer, when to (re-)observe, when to disconnect)
 * is left to the caller, because the consuming hooks drive it differently —
 * some from a ref callback, some from a layout effect.
 */
export const createFrameResizeObserver = (
  measure: () => void,
): FrameResizeObserver => {
  let frame: number | null = null;

  const schedule = () => {
    if (frame !== null) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      frame = null;
      measure();
    });
  };

  const observer = new ResizeObserver(schedule);

  return {
    observe: (targets) => {
      observer.disconnect();
      for (const target of targets) {
        observer.observe(target);
      }
    },
    schedule,
    disconnect: () => {
      observer.disconnect();
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    },
  };
};

export default createFrameResizeObserver;
