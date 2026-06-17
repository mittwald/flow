import { useEffect, useState } from "react";
import { duration } from "../models/ActionState";

export const useIsPendingWithWait = (isPending: boolean) => {
  const [isPendingWithWait, setIsPendingWithWait] = useState(false);

  useEffect(() => {
    if (isPending) {
      const timeout = setTimeout(() => {
        setIsPendingWithWait(true);
      }, duration.pending);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setIsPendingWithWait(false);
    }
  }, [isPending, setIsPendingWithWait]);

  return isPendingWithWait;
};
