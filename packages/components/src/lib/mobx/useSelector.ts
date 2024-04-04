import { autorun } from "mobx";
import { useEffect, useState } from "react";

export type MobXSelector<T> = () => T;

/** Use this hook to select reactive state from the store */
export const useSelector = <T>(
  select: MobXSelector<T>,
  deps: unknown[] = [],
): T => {
  const [selected, setSelected] = useState<T>(select());

  useEffect(() => {
    return autorun(() => {
      setSelected(select());
    });
  }, deps);

  return selected;
};

export default useSelector;
