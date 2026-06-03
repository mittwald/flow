const listeners = new Set<() => void>();

const epoch = performance.now();
let now = epoch;
let requestedAnimationFrameId: number | null = null;

const callListeners = () => listeners.forEach((l) => l());

const animationFrameTick = (ts: number) => {
  now = ts;
  callListeners();
  requestedAnimationFrameId = requestAnimationFrame(animationFrameTick);
};

export const globalSpinnerClockStore = {
  getEpoch: () => epoch,
  getSnapshot: () => now,
  getServerSnapshot: () => 0,

  subscribe: (callbackFn: () => void) => {
    listeners.add(callbackFn);

    if (requestedAnimationFrameId == null) {
      requestedAnimationFrameId = requestAnimationFrame(animationFrameTick);
    }

    return () => {
      listeners.delete(callbackFn);

      if (listeners.size === 0 && requestedAnimationFrameId !== null) {
        cancelAnimationFrame(requestedAnimationFrameId);
        requestedAnimationFrameId = null;
      }
    };
  },
};
