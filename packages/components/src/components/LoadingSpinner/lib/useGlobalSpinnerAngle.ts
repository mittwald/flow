import { useSyncExternalStore } from "react";
import { globalSpinnerClockStore } from "@/components/LoadingSpinner/lib/globalSpinnerClockStore";

/** @internal * */
export const useGlobalSpinnerAngle = (animationDurationMs = 900) => {
  const now = useSyncExternalStore(
    globalSpinnerClockStore.subscribe,
    globalSpinnerClockStore.getSnapshot,
    globalSpinnerClockStore.getServerSnapshot,
  );

  const elapsed = now - globalSpinnerClockStore.getEpoch();
  const angle = ((elapsed % animationDurationMs) / animationDurationMs) * 360;
  return angle < 0 ? angle + 360 : angle;
};
