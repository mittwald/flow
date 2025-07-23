import { usePromise } from "@mittwald/react-use-promise";
import { useId, useRef, useState } from "react";

export const useControllableSuspenseTrigger = () => {
  const localId = useId();
  const promise = useRef<PromiseWithResolvers<void>>(null);
  const [startedCount, setStartedCount] = useState(0);

  usePromise(
    (promise: Promise<void>) => promise,
    promise.current ? [promise.current.promise] : null,
    {
      keepValueWhileLoading: false,
      loaderId: localId + startedCount,
    },
  );

  return {
    start: () => {
      promise.current = Promise.withResolvers<void>();
      setStartedCount((c) => c + 1);
    },
    stop: () => {
      promise.current?.resolve();
    },
  };
};
