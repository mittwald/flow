import { useEffect, useRef } from "react";
import Timer from "@/lib/timer/Timer";

export const useTimer = (): Timer => {
  const timerClass = useRef(new Timer()).current;

  useEffect(() => {
    return () => {
      //timerClass.stop();
    };
  });

  return timerClass;
};
