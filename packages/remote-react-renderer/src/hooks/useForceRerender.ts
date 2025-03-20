import { useState } from "react";

export const useForceRerender = () => {
  const [, setTrigger] = useState(false);

  return () => {
    setTrigger((t) => !t);
  };
};
